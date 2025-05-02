import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomerstatusRemarksComponent } from './view-customerstatus-remarks.component';

describe('ViewCustomerstatusRemarksComponent', () => {
  let component: ViewCustomerstatusRemarksComponent;
  let fixture: ComponentFixture<ViewCustomerstatusRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCustomerstatusRemarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomerstatusRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
