import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBusinessComponent } from './login-business.component';

describe('LoginBusinessComponent', () => {
  let component: LoginBusinessComponent;
  let fixture: ComponentFixture<LoginBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
