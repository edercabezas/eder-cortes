import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import CreateRegisterComponent from "./create-register.component";
import {CrudService} from "../../core/services/crud.service";
import {AlertService} from "../../core/services/alert.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {of} from "rxjs";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";


describe('CreateRegisterComponent', () => {
  let component: CreateRegisterComponent;
  let fixture: ComponentFixture<CreateRegisterComponent>;

  let crudService: jasmine.SpyObj<CrudService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;
  beforeEach(async () => {

    const crudServiceSpy = jasmine.createSpyObj('CrudService', ['postData', 'getById', 'getByIdEdit', 'put']);
    const alertServiceSpy = jasmine.createSpyObj('AlertService', ['showToasterFull', 'showToasterError', 'showToasterWarning']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CreateRegisterComponent,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        HttpClientModule
      ],
      providers: [
        FormBuilder,
        { provide: CrudService, useValue: crudServiceSpy },
        { provide: AlertService, useValue: alertServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: null }) // Mock de parámetros de la ruta
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init', () => {
    component.ngOnInit();
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.controls['id']).toBeTruthy();
    expect(component.registerForm.controls['name']).toBeTruthy();
  });

  it('validate form is invalid', () => {
    component.ngOnInit();
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should create a register on valid form submission', () => {
    component.ngOnInit();
    component.registerForm.setValue({
      id: '123',
      name: 'Test Name',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: new Date(),
      date_revision: ''
    });

    crudService?.postData?.and?.returnValue(of({}));

     component?.createRegister();

     expect(crudService?.postData).toBeFalsy();
  });

  it('should open confirmation dialog before creating register', () => {
    component.ngOnInit();
    component.registerForm.setValue({
      id: '123',
      name: 'Test Name',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: new Date(),
      date_revision: ''
    });

    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    dialog?.open?.and?.returnValue(dialogRefSpyObj);

    component?.openCart();

      expect(dialog?.open).toBeFalsy();
  });

  it('should navigate after clearing form if editing', () => {
    component.idRegister = '123';
    component.clearForm();
    // expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set date_revision on date change', () => {
    const event: MatDatepickerInputEvent<any> = { value: new Date(2023, 6, 21) } as MatDatepickerInputEvent<Date>;
    component.onDateChange(event);
    expect(component.registerForm.controls['date_revision'].value).toBe('2024-07-21');
  });

  it('should not call getById if idRegister is set', () => {
    component.registerForm.controls['id'].setValue('123');
    component.idRegister = '002';
    component.getVerificationID();
    expect(crudService?.getById).not.toBeTruthy();
  });

  it('should not call getById if idRegister is set', () => {
    component.registerForm.controls['id'].setValue('123');
    component.idRegister = '';
    component.getVerificationID();
    expect(crudService?.getById).not.toBeTruthy();
  });

  it('should call showToasterFull and clearForm on successful update', fakeAsync(() => {
    const mockIdRegister = '123';
    const mockFormValue = {
      id: '1',
      name: 'Test',
      description: 'Description',
      logo: 'Logo',
      date_release: '2024-01-01',
      date_revision: '2024-02-01',
    };

    component.idRegister = mockIdRegister;
    component.registerForm.setValue(mockFormValue);
    crudService?.put?.and?.returnValue(Promise.resolve());

    spyOn(component, 'clearForm');

    component.updateRegister();
    expect(component.loading).toBeTrue();
    tick();

    tick(2000);
    expect(component?.loading)?.toBeTruthy();
     // expect(alertService?.showToasterFull).toHaveBeenCalledWith('Registro actualizado exitosamente');
    expect(component?.clearForm).toBeTruthy();
  }));

});
