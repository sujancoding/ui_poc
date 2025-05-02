import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationMarketingComponent } from './organization-marketing.component';

describe('OrganizationMarketingComponent', () => {
  let component: OrganizationMarketingComponent;
  let fixture: ComponentFixture<OrganizationMarketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationMarketingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
