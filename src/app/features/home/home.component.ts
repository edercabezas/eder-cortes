import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {CrudService} from "../../core/services/crud.service";
import {MatMenuModule} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {AlertService} from "../../core/services/alert.service";
import {ModalInfoComponent} from "../../shared/modals/modal-info/modal-info.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButton,
    FormsModule,
    MatMenuModule,
    MatIcon,
    MatIconButton,
    DatePipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export default class HomeComponent implements OnInit {

  dataSource: any;
  totalProducts: number = 0;
  public selectIndexTable: number | undefined;
  public inputForm: string;

  tableConventionsColumns: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private crud: CrudService,
    private router: Router,
    private alert: AlertService,
    public dialog: MatDialog) {
    this.inputForm = '';
    this.tableConventionsColumns = [];
  }

  ngOnInit(): void {
    this.getDataRegister();
    this._customerTableColumns();
  }

  /**
   * Metodo encargado de listarme todos los registros creados
   */

  getDataRegister(): void {
    this.crud.readData('products').then((response: any) => {
      this.dataSource = new MatTableDataSource<any>(response.data);
      this.dataSource.paginator = this.paginator;
      this.totalProducts = response.data.length;

    }).catch((error: any) => {
      console.log(error)
    })
  }

  /**
   * Metodo que em envía a la pantalla de crear nuevo registro
   */
  public createNewRegister(): void {
    this.router.navigate(['create-register'])
  }

  /**
   * Metodo para que me envíe por medio de url a la pantalla de edición
   * @param code
   */
  public editRegister(code: string): void {
    this.router.navigate(['edit-register', code])
  }

  /**
   * Metodo encargado de la eliminación de un registro
   * @param code
   */
  public deleteRegister(code: string): void {

    this.crud.delete(code).subscribe({
      next: () => {
        this.alert.showToasterFull('Registro eliminado exitosamente');
        setTimeout(() => {
          this.getDataRegister();
        }, 2000)
      },
      error: () => this.alert.showToasterError('Error al eliminar el registro')
    });
  }

  /**
   * Buscar productos por nombre
   */
  searchProduct(): void {

    let dataFilter = this.dataSource.filteredData

    if (this.inputForm) {
      dataFilter = dataFilter.filter((res: any) => {
        return res.name.toLowerCase().includes(this.inputForm?.toLowerCase())
      });

      this.dataSource = new MatTableDataSource<any>(dataFilter);

    } else {
      this.getDataRegister();
    }

  }

  /**
   * Modal de confirmación antes de hacer una acción ene ste caso eliminar un registro
   * @param element
   */
  openCart(element: any): void {
    const dialog: any = this.dialog.open(ModalInfoComponent, {
      width: '700px',
      height: '350px',
      data: {
        title: `Esta seguro de eliminar el registro : ${element?.name}?`,
        buttons: {
          cancel: 'Cancelar',
          confirm: 'Confirmar'
        },
        item: 'data'
      }
    });

    dialog.afterClosed().subscribe({
      next: (response: any): void => {
        if (response) {
          this.deleteRegister(element?.id);
        }
      }
    });

  }

  /**
   * Identificador de cada uno de los encabezados que lleva la tabla
   * @private
   */
  private _customerTableColumns(): void {
    this.tableConventionsColumns = [
      'logo',
      'name',
      'description',
      'date_release',
      'date_revision',
      'action',
    ];
  }

}
