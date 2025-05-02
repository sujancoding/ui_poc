import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDealSummaryComponent } from './view-deal-summary.component';

describe('ViewDealSummaryComponent', () => {
  let component: ViewDealSummaryComponent;
  let fixture: ComponentFixture<ViewDealSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDealSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDealSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
