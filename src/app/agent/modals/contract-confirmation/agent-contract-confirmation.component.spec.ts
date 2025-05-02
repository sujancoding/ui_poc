import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentContractConfirmationComponent } from './agent-contract-confirmation.component';

describe('AgentContractConfirmationComponent', () => {
  let component: AgentContractConfirmationComponent;
  let fixture: ComponentFixture<AgentContractConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentContractConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentContractConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
