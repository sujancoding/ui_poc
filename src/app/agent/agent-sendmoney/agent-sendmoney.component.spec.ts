import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSendmoneyComponent } from './agent-sendmoney.component';

describe('AgentSendmoneyComponent', () => {
  let component: AgentSendmoneyComponent;
  let fixture: ComponentFixture<AgentSendmoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentSendmoneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentSendmoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
