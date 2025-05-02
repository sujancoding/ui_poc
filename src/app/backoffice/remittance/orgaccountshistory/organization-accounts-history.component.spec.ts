import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAccountsHistoryComponent } from './organization-accounts-history.component';

describe('OrganizationAccountsHistoryComponent', () => {
  let component: OrganizationAccountsHistoryComponent;
  let fixture: ComponentFixture<OrganizationAccountsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationAccountsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationAccountsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
