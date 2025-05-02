import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManagementReportConfirmationDialogComponent } from './view-management-report-confirmation-dialog.component';

describe('ViewManagementReportConfirmationDialogComponent', () => {
  let component: ViewManagementReportConfirmationDialogComponent;
  let fixture: ComponentFixture<ViewManagementReportConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewManagementReportConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManagementReportConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
