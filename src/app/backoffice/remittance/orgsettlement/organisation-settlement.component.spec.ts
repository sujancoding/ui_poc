import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationSettlementComponent } from './organisation-settlement.component';

describe('OrganisationSettlementComponent', () => {
  let component: OrganisationSettlementComponent;
  let fixture: ComponentFixture<OrganisationSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
