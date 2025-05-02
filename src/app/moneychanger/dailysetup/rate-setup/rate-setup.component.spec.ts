import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateSetupComponent } from './rate-setup.component';

describe('RateSetupComponent', () => {
  let component: RateSetupComponent;
  let fixture: ComponentFixture<RateSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RateSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
