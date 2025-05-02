import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDetailsBackofficeComponent } from './review-details-backoffice.component';

describe('ReviewDetailsBackofficeComponent', () => {
  let component: ReviewDetailsBackofficeComponent;
  let fixture: ComponentFixture<ReviewDetailsBackofficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDetailsBackofficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDetailsBackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
