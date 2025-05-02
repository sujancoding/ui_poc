import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchShipmentComponent } from './search-shipment.component';

describe('SearchShipmentComponent', () => {
  let component: SearchShipmentComponent;
  let fixture: ComponentFixture<SearchShipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchShipmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchShipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
