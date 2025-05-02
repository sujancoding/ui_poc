import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementReportsComponent } from './management-reports.component';

describe('ManagementReportsComponent', () => {
  let component: ManagementReportsComponent;
  let fixture: ComponentFixture<ManagementReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
