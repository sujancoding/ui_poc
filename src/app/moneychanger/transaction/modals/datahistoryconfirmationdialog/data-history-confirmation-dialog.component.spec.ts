import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataHistoryConfirmationDialogComponent } from './data-history-confirmation-dialog.component';

describe('DataHistoryConfirmationDialogComponent', () => {
  let component: DataHistoryConfirmationDialogComponent;
  let fixture: ComponentFixture<DataHistoryConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataHistoryConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataHistoryConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
