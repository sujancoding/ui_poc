import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtAddKycConfigComponent } from './rt-add-kyc-config.component';

describe('RtAddKycConfigComponent', () => {
  let component: RtAddKycConfigComponent;
  let fixture: ComponentFixture<RtAddKycConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RtAddKycConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RtAddKycConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
