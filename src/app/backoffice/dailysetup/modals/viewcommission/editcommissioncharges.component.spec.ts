import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditcommissionchargesComponent } from './editcommissioncharges.component';

describe('EditcommissionchargesComponent', () => {
  let component: EditcommissionchargesComponent;
  let fixture: ComponentFixture<EditcommissionchargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditcommissionchargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditcommissionchargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
