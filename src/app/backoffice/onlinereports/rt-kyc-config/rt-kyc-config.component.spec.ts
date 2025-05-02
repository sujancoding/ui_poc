import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtKycConfigComponent } from './rt-kyc-config.component';

describe('RtKycConfigComponent', () => {
  let component: RtKycConfigComponent;
  let fixture: ComponentFixture<RtKycConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RtKycConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RtKycConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
