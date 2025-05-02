import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSettlementComponent } from './agent-settlement.component';

describe('AgentSettlementComponent', () => {
  let component: AgentSettlementComponent;
  let fixture: ComponentFixture<AgentSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
