import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateProgressReportComponent } from './corporate-progress-report.component';

describe('CorporateProgressReportComponent', () => {
  let component: CorporateProgressReportComponent;
  let fixture: ComponentFixture<CorporateProgressReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateProgressReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateProgressReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
