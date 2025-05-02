import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentViewContractsComponent } from './agent-view-contracts.component';

describe('AgentViewContractsComponent', () => {
  let component: AgentViewContractsComponent;
  let fixture: ComponentFixture<AgentViewContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentViewContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentViewContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
