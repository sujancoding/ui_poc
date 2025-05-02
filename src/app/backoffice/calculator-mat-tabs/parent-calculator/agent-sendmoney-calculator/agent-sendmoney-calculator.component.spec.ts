import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSendmoneyCalculatorComponent } from './agent-sendmoney-calculator.component';

describe('AgentSendmoneyCalculatorComponent', () => {
  let component: AgentSendmoneyCalculatorComponent;
  let fixture: ComponentFixture<AgentSendmoneyCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentSendmoneyCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSendmoneyCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
