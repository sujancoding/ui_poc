import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfirmationDialogComponent } from './admin-confirmation-dialog.component';

describe('AdminConfirmationDialogComponent', () => {
  let component: AdminConfirmationDialogComponent;
  let fixture: ComponentFixture<AdminConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
