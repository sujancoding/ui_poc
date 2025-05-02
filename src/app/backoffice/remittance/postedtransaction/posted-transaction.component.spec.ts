import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostedTransactionComponent } from './posted-transaction.component';

describe('PostedTransactionComponent', () => {
  let component: PostedTransactionComponent;
  let fixture: ComponentFixture<PostedTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostedTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostedTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
