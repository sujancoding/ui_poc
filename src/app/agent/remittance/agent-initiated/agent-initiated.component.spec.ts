import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentInitiatedComponent } from './agent-initiated.component';

describe('AgentInitiatedComponent', () => {
  let component: AgentInitiatedComponent;
  let fixture: ComponentFixture<AgentInitiatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentInitiatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentInitiatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
