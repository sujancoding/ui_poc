import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipsMaintenanceComponent } from './pips-maintenance.component';

describe('PipsMaintenanceComponent', () => {
  let component: PipsMaintenanceComponent;
  let fixture: ComponentFixture<PipsMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipsMaintenanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipsMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
