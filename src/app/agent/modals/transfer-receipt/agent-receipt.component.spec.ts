import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentReceiptComponent } from './agent-receipt.component';

describe('AgentReceiptComponent', () => {
  let component: AgentReceiptComponent;
  let fixture: ComponentFixture<AgentReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
