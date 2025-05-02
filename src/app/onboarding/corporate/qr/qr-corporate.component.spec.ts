import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCorporateComponent } from './qr-corporate.component';

describe('QrCorporateComponent', () => {
  let component: QrCorporateComponent;
  let fixture: ComponentFixture<QrCorporateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrCorporateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
