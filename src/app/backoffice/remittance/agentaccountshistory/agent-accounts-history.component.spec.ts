import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentAccountsHistoryComponent } from './agent-accounts-history.component';

describe('AgentAccountsHistoryComponent', () => {
  let component: AgentAccountsHistoryComponent;
  let fixture: ComponentFixture<AgentAccountsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentAccountsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentAccountsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
