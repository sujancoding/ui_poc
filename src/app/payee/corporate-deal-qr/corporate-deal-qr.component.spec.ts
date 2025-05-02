import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateDealQrComponent } from './corporate-deal-qr.component';

describe('CorporateDealQrComponent', () => {
  let component: CorporateDealQrComponent;
  let fixture: ComponentFixture<CorporateDealQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateDealQrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateDealQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
