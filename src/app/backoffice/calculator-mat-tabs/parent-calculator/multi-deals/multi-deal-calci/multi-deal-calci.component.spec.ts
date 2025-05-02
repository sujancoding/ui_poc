import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDealCalciComponent } from './multi-deal-calci.component';

describe('MultiDealCalciComponent', () => {
  let component: MultiDealCalciComponent;
  let fixture: ComponentFixture<MultiDealCalciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDealCalciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDealCalciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
