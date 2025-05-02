import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryVerticalSidebarComponent } from './inventory-vertical-sidebar.component';

describe('InventoryVerticalSidebarComponent', () => {
  let component: InventoryVerticalSidebarComponent;
  let fixture: ComponentFixture<InventoryVerticalSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryVerticalSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryVerticalSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
