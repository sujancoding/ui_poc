import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentMarginTierUpdateComponent } from './agent-margin-tier-update.component';

describe('AgentMarginTierUpdateComponent', () => {
  let component: AgentMarginTierUpdateComponent;
  let fixture: ComponentFixture<AgentMarginTierUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentMarginTierUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentMarginTierUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
