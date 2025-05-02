import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentProfilesComponent } from './agent-profiles.component';

describe('AgentProfilesComponent', () => {
  let component: AgentProfilesComponent;
  let fixture: ComponentFixture<AgentProfilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentProfilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
