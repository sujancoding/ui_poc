import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateConfirmationDialogComponent } from './corporate-confirmation-dialog.component';

describe('CorporateConfirmationDialogComponent', () => {
  let component: CorporateConfirmationDialogComponent;
  let fixture: ComponentFixture<CorporateConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
