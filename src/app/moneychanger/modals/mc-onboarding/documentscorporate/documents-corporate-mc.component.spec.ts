import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsCorporateMcComponent } from './documents-corporate-mc.component';

describe('DocumentsCorporateMcComponent', () => {
  let component: DocumentsCorporateMcComponent;
  let fixture: ComponentFixture<DocumentsCorporateMcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsCorporateMcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsCorporateMcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
