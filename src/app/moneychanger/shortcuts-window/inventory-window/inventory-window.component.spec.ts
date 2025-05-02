import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryWindowComponent } from './inventory-window.component';

describe('InventoryWindowComponent', () => {
  let component: InventoryWindowComponent;
  let fixture: ComponentFixture<InventoryWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
