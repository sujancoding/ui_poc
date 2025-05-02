import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDealWindowComponent } from './add-deal-window.component';

describe('AddDealWindowComponent', () => {
  let component: AddDealWindowComponent;
  let fixture: ComponentFixture<AddDealWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDealWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDealWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
