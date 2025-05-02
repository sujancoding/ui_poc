import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealListingWindowComponent } from './deal-listing-window.component';

describe('DealListingWindowComponent', () => {
  let component: DealListingWindowComponent;
  let fixture: ComponentFixture<DealListingWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealListingWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealListingWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
