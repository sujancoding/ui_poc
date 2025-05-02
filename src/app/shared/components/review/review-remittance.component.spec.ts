import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewRemittanceComponent } from './review-remittance.component';

describe('ReviewRemittanceComponent', () => {
  let component: ReviewRemittanceComponent;
  let fixture: ComponentFixture<ReviewRemittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewRemittanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewRemittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
