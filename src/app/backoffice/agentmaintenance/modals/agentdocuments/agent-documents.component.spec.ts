import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDocumentsComponent } from './agent-documents.component';

describe('AgentDocumentsComponent', () => {
  let component: AgentDocumentsComponent;
  let fixture: ComponentFixture<AgentDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
