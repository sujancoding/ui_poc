import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDealComponent } from './agent-deal.component';

describe('AgentDealComponent', () => {
  let component: AgentDealComponent;
  let fixture: ComponentFixture<AgentDealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentDealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
