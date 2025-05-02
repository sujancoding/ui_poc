import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEndConfirmationDialogComponent } from './day-end-confirmation-dialog.component';

describe('DayEndConfirmationDialogComponent', () => {
  let component: DayEndConfirmationDialogComponent;
  let fixture: ComponentFixture<DayEndConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayEndConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayEndConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
