import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInfoComponent } from './modal-info.component';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

describe('ModalInfoComponent', () => {
  let component: ModalInfoComponent;
  let fixture: ComponentFixture<ModalInfoComponent>;
  let dialogRef: MatDialogRef<ModalInfoComponent>;
  let closeSpy: jasmine.Spy;

  beforeEach(async () => {

    closeSpy = jasmine.createSpy('close');

    dialogRef = {
      close: closeSpy
    } as any;


    await TestBed.configureTestingModule({
      imports: [ModalInfoComponent, MatButton],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} } // Mock data if needed
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInfoComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dialogRef.close with false when onNoClick is called', () => {
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith(false);
  });

  it('should call dialogRef.close with true when returnConfirm is called', () => {
    component.returnConfirm();
    expect(closeSpy).toHaveBeenCalledWith(true);
  });

});
