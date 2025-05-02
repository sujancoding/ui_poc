import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsIndividualMcComponent } from './documents-individual-mc.component';

describe('DocumentsIndividualMcComponent', () => {
  let component: DocumentsIndividualMcComponent;
  let fixture: ComponentFixture<DocumentsIndividualMcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsIndividualMcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsIndividualMcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
