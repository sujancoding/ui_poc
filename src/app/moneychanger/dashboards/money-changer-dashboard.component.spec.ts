import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyChangerDashboardComponent } from './money-changer-dashboard.component';

describe('MoneyChangerDashboardComponent', () => {
  let component: MoneyChangerDashboardComponent;
  let fixture: ComponentFixture<MoneyChangerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyChangerDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyChangerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
