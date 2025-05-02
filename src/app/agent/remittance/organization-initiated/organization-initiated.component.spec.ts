import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationInitiatedComponent } from './organization-initiated.component';

describe('OrganizationInitiatedComponent', () => {
  let component: OrganizationInitiatedComponent;
  let fixture: ComponentFixture<OrganizationInitiatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationInitiatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationInitiatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
