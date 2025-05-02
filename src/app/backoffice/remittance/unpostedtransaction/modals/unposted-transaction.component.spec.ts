import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpostedTransactionComponent } from './unposted-transaction.component';

describe('UnpostedTransactionComponent', () => {
  let component: UnpostedTransactionComponent;
  let fixture: ComponentFixture<UnpostedTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnpostedTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpostedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
