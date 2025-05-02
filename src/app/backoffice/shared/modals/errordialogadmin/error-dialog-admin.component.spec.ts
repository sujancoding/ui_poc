import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialogAdminComponent } from './error-dialog-admin.component';

describe('ErrorDialogAdminComponent', () => {
  let component: ErrorDialogAdminComponent;
  let fixture: ComponentFixture<ErrorDialogAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorDialogAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDialogAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
