import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetAccountsHistoryComponent } from './reset-accounts-history.component';

describe('ResetAccountsHistoryComponent', () => {
  let component: ResetAccountsHistoryComponent;
  let fixture: ComponentFixture<ResetAccountsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetAccountsHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetAccountsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
