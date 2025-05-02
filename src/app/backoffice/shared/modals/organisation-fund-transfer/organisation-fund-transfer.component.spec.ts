import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationFundTransferComponent } from './organisation-fund-transfer.component';

describe('OrganisationFundTransferComponent', () => {
  let component: OrganisationFundTransferComponent;
  let fixture: ComponentFixture<OrganisationFundTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationFundTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationFundTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
