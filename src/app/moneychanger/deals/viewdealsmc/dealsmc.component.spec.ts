import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsmcComponent } from './dealsmc.component';

describe('DealsmcComponent', () => {
  let component: DealsmcComponent;
  let fixture: ComponentFixture<DealsmcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealsmcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
