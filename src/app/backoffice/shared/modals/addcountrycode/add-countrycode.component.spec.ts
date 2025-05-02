import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountrycodeComponent } from './add-countrycode.component';

describe('AddCountrycodeComponent', () => {
  let component: AddCountrycodeComponent;
  let fixture: ComponentFixture<AddCountrycodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCountrycodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCountrycodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
