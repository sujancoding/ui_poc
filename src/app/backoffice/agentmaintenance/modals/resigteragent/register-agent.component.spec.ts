import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAgentComponent } from './register-agent.component';

describe('RegisterAgentComponent', () => {
  let component: RegisterAgentComponent;
  let fixture: ComponentFixture<RegisterAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterAgentComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
