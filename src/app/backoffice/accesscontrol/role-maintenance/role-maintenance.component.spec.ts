import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMaintenanceComponent } from './role-maintenance.component';

describe('RoleMaintenanceComponent', () => {
  let component: RoleMaintenanceComponent;
  let fixture: ComponentFixture<RoleMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
