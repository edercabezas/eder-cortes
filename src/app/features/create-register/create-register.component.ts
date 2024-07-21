import {Component, OnInit} from '@angular/core';
import {MatFormField, MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {NgClass, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {CrudService} from '../../core/services/crud.service';
import {MatDialog} from '@angular/material/dialog';
import {ModalInfoComponent} from '../../shared/modals/modal-info/modal-info.component';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerModule,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {AlertService} from '../../core/services/alert.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingComponent} from "../../shared/components/loading/loading.component";

@Component({
  selector: 'app-create-register',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatIcon,
    MatInput,
    MatLabel,
    NgIf,
    MatButton,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    NgClass,
    LoadingComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './create-register.component.html',
  styleUrl: './create-register.component.scss'
})
export default class CreateRegisterComponent implements OnInit {
  public registerForm!: FormGroup;
  public idRegister: any;
  public isDisabled: boolean;
  public loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private crud: CrudService,
    public dialog: MatDialog,
    private alert: AlertService,
    private _activatedRoute: ActivatedRoute,
    public router: Router) {

    this.isDisabled = false;
    this.loading = false;

  }


  ngOnInit(): void {
    this.init();
    this.codeEdit();
  }

  /**
   * Metodo encargado de la creación de registros
   */
  public createRegister() {
    this.loading = true;
    this.registerForm.controls['date_release'].setValue(this.registerForm?.controls['date_release']?.value.toISOString())
    this.crud?.postData(this.registerForm?.value)?.subscribe({
      next: () => {

        setTimeout( () => {
          this.loading = false;
          this.alert?.showToasterFull('Registro guardado exitosamente');
          this.clearForm();
        }, 2000);


      },
      error: () => {
        this.alert?.showToasterError('Error al guardado el registro')
        this.loading = false;
      }
    });

  }

  /**
   * Modal de confirmación antes de crear registro o editarlo
   */
  openCart(): void {

    if (!this.registerForm?.valid) {
      this.registerForm.markAllAsTouched();
      this.alert.showToasterWarning('Todos los campos son requeridos para continuar');
      return;
    }
    const message: any = this.idRegister ? 'Quiere editar el registro ' : 'Esta seguro que quiere crear este registro '
    const dialog = this.dialog?.open(ModalInfoComponent, {
      width: '700px',
      height: '350px',
      data: {
        title: `${message} : ${this.registerForm?.controls['name']?.value} ?`,
        buttons: {
          cancel: 'Cancelar',
          confirm: 'Confirmar'
        },
        item: 'data'
      }
    });

    dialog?.afterClosed()?.subscribe({
      next: (response: any): void => {
        if (response) {
          if (this.idRegister) {
            this.updateRegister();
            return;
          }
          this.createRegister();
        }
      }
    });

  }

  /**
   * Metodo para consultar el ID ingresado y validar si ya existe
   */
  public getVerificationID(): void {
    const id = this.registerForm.controls['id'].value;
    if (id.length < 3) {
      return;
    }
    if (this.idRegister) {
      return;
    }

    this.crud?.getById(id, '/verification')?.then((response: any) => {

      if (response) {
        this.alert.showToasterError('Este ID ya esta en uso');

        setTimeout(() => {
          this.registerForm.controls['id'].setValue('');
        }, 4000)
      }
    })
  }

  /**
   * Consulta un único registro el cual voy a editar por medio del ID que llega por URL
   * @param id
   */
  getRegisterEdit(id: any): void {
    this.crud.getByIdEdit(id).then((response: any) => {
      this.registerForm.setValue(response);
    })
  }

  /**
   * metodo para obtener el ID que llega por url cuando selecciono la opción editar en la pantalla anterior
   */
  codeEdit(): void {
    this._activatedRoute.params.subscribe((value: any) => {
      if (value.id) {
        this.idRegister = value.id;
        this.isDisabled = true;
        this.getRegisterEdit(value.id);
      }

    });
  }

  /**
   * Metodo para hacer la actualización del registro
   */
  updateRegister(): void {
    this.loading = true;
    this.crud?.put(this.registerForm?.value, this.idRegister)?.then(() => {

      setTimeout( () => {
        this.loading = false;
        this.alert.showToasterFull('Registro actualizado exitosamente');
        this.clearForm();
      }, 2000);


    }).catch(() => {
      this.loading = false;
      this.alert.showToasterError('Error al actualizar el registro');
    })
  }


  /**
   * Limpio el formulario siempre y cuando sea nuevo registro de lo contrario lo mando al listado de registros
   */
  public clearForm(): void {

    if (this.idRegister) {
      this.navigate();
    }


    this.registerForm.setValue({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: '',
    });
  }

  /**
   * NAvegar a la pagina inicial o al listado
   */
  navigate(): void {
    this.router?.navigate(['/']);
  }

  /**
   * Este metodo se encarga de poner la fecha de manera automática en el campo de Fecha revisión
   * @param event
   */
  onDateChange(event: MatDatepickerInputEvent<Date>) {

    const selectedDate: Date | any = event.value;

    const year = selectedDate.getFullYear() + 1;
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();

    const dataRevision: string = `${year}-${month.toString().length === 1 ? '0' + month : month}-${day.toString().length === 1 ? '0' +day : day}`.toString();
    this.registerForm.controls['date_revision'].setValue(dataRevision);
  }

  /**
   * Inicializo los campos del formulario y asigno validaciones a cada uno
   */

  init(): void {
    this.registerForm = this.formBuilder.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [''],
    });
  }

}
