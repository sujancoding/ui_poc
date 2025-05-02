import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviseExchangeComponent } from './revise-exchange.component';

describe('ReviseExchangeComponent', () => {
  let component: ReviseExchangeComponent;
  let fixture: ComponentFixture<ReviseExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviseExchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviseExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
