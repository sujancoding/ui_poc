import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionchargesComponent } from './commissioncharges.component';

describe('CommissionchargesComponent', () => {
  let component: CommissionchargesComponent;
  let fixture: ComponentFixture<CommissionchargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionchargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionchargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
