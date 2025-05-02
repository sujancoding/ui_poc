import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentNewDealMcComponent } from './parent-new-deal-mc.component';

describe('ParentNewDealMcComponent', () => {
  let component: ParentNewDealMcComponent;
  let fixture: ComponentFixture<ParentNewDealMcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentNewDealMcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentNewDealMcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
