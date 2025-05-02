import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchuserDashboardComponent } from './branchuser-dashboard.component';

describe('BranchuserDashboardComponent', () => {
  let component: BranchuserDashboardComponent;
  let fixture: ComponentFixture<BranchuserDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchuserDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchuserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
