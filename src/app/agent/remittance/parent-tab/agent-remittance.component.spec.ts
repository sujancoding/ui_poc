import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRemittanceComponent } from './agent-remittance.component';

describe('AgentRemittanceComponent', () => {
  let component: AgentRemittanceComponent;
  let fixture: ComponentFixture<AgentRemittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentRemittanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentRemittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
