import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureDenominationComponent } from './capture-denomination.component';

describe('CaptureDenominationComponent', () => {
  let component: CaptureDenominationComponent;
  let fixture: ComponentFixture<CaptureDenominationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureDenominationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureDenominationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
