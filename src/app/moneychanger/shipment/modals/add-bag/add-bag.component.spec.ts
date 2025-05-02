import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBagComponent } from './add-bag.component';

describe('AddBagComponent', () => {
  let component: AddBagComponent;
  let fixture: ComponentFixture<AddBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
