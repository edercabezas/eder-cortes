import { ComponentFixture, TestBed } from '@angular/core/testing';
import HomeComponent from "./home.component";
import {CrudService} from "../../core/services/crud.service";
import {AlertService} from "../../core/services/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatMenuModule} from "@angular/material/menu";
import {MatIcon} from "@angular/material/icon";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {of} from "rxjs";


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let crudService: jasmine.SpyObj<CrudService>;
  let alertService: jasmine.SpyObj<AlertService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const crudSpy = jasmine.createSpyObj('CrudService', ['readData', 'delete']);
    const spyAlert = jasmine.createSpyObj('AlertService', ['showToasterFull', 'showToasterError']);
    const spyDialog = jasmine.createSpyObj('MatDialog', ['open']);
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        MatTableModule,
        MatPaginatorModule,
        MatButton,
        FormsModule,
        MatMenuModule,
        MatIcon,
        MatIconButton,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: AlertService, useValue: spyAlert },
        { provide: MatDialog, useValue: spyDialog },
        { provide: Router, useValue: spyRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    crudService = TestBed.inject(CrudService) as jasmine.SpyObj<CrudService>;
    alertService = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should call getDataRegister on init', () => {
    const getDataRegisterSpy = spyOn(component, 'getDataRegister').and.callThrough();
    component.ngOnInit();
    expect(getDataRegisterSpy).toHaveBeenCalled();
  });

  it('should initialize and load data', () => {
    const mockData = { data: [{ id: 1, name: 'Test Product' }] };
    crudService.readData.and.returnValue(Promise.resolve(mockData));
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.dataSource.data).toEqual(mockData.data);
      expect(component.totalProducts).toBe(mockData.data.length);
    });
  });

  it('should navigate to create new register', () => {
    component.createNewRegister();
    expect(router.navigate).toHaveBeenCalledWith(['create-register']);
  });

  it('should navigate to edit register', () => {
    const code = '123';
    component.editRegister(code);
    expect(router.navigate).toHaveBeenCalledWith(['edit-register', code]);
  });

  it('should delete a register and reload data', () => {
    const code = '123';
    crudService.delete.and.returnValue(of({}));
    spyOn(component, 'getDataRegister'); // Spy on the getDataRegister method

    component.deleteRegister(code);
    expect(crudService.delete).toHaveBeenCalledWith(code);
    expect(alertService.showToasterFull).toHaveBeenCalledWith('Registro eliminado exitosamente');
    expect(component.getDataRegister).toBeTruthy();
  });

  it('should filter products by name', () => {
    component.dataSource = new MatTableDataSource<any>([
      { name: 'Test Product 1' },
      { name: 'Another Product' },
    ]);

    component.inputForm = 'Test';
    component.searchProduct();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Test Product 1');

    component.inputForm = '';
    component.searchProduct();
    expect(crudService.readData).toHaveBeenCalled();
  });

  it('should open confirmation dialog before deleting a register', () => {
    const element = { id: '123', name: 'Test Product' };
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    dialog.open.and.returnValue(dialogRefSpyObj);

    component.openCart(element);

    expect(dialog.open).toHaveBeenCalled();
    dialogRefSpyObj.afterClosed().subscribe(() => {
      expect(crudService.delete).toHaveBeenCalledWith(element.id);
    });
  });

});
