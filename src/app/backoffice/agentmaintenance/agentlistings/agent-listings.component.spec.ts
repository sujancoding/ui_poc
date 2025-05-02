import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentListingsComponent } from './agent-listings.component';

describe('AgentListingsComponent', () => {
  let component: AgentListingsComponent;
  let fixture: ComponentFixture<AgentListingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentListingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
