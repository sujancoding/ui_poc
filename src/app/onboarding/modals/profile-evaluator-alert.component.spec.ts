import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileEvaluatingComponent } from './profile-evaluator-alert.component';

describe('ProfileEvaluatingComponent', () => {
  let component: ProfileEvaluatingComponent;
  let fixture: ComponentFixture<ProfileEvaluatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileEvaluatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileEvaluatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
