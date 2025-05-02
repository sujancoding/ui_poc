import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDealsComponent } from './shipment-deals.component';

describe('ShipmentDealsComponent', () => {
  let component: ShipmentDealsComponent;
  let fixture: ComponentFixture<ShipmentDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentDealsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
