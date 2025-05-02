import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBranchuserComponent } from './login-branchuser.component';

describe('LoginBranchuserComponent', () => {
  let component: LoginBranchuserComponent;
  let fixture: ComponentFixture<LoginBranchuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginBranchuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBranchuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
