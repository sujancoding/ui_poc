import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationExpensesAddComponent } from './organisation-expenses-add.component';

describe('OrganisationExpensesAddComponent', () => {
  let component: OrganisationExpensesAddComponent;
  let fixture: ComponentFixture<OrganisationExpensesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationExpensesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationExpensesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
