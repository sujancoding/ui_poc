import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycReportsConfigComponent } from './kyc-reports-config.component';

describe('KycReportsConfigComponent', () => {
  let component: KycReportsConfigComponent;
  let fixture: ComponentFixture<KycReportsConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycReportsConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycReportsConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
