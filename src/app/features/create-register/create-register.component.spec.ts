import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRegisterComponent } from './create-register.component';

describe('CreateRegisterComponent', () => {
  let component: CreateRegisterComponent;
  let fixture: ComponentFixture<CreateRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
