import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationAssetAccountSettlementComponent } from './organisation-asset-account-settlement.component';

describe('OrganisationAssetAccountSettlementComponent', () => {
  let component: OrganisationAssetAccountSettlementComponent;
  let fixture: ComponentFixture<OrganisationAssetAccountSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationAssetAccountSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationAssetAccountSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
