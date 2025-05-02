import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAssociatesComponent } from './agent-associates.component';

describe('AgentAssociatesComponent', () => {
  let component: AgentAssociatesComponent;
  let fixture: ComponentFixture<AgentAssociatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAssociatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAssociatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
