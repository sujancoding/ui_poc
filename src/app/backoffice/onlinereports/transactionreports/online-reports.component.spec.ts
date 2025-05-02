import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineReportsComponent } from './online-reports.component';

describe('OnlineReportsComponent', () => {
  let component: OnlineReportsComponent;
  let fixture: ComponentFixture<OnlineReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
