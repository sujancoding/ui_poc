import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationResetAccountBalanceComponent } from './organisation-reset-account-balance.component';

describe('OrganisationResetAccountBalanceComponent', () => {
  let component: OrganisationResetAccountBalanceComponent;
  let fixture: ComponentFixture<OrganisationResetAccountBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationResetAccountBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationResetAccountBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
