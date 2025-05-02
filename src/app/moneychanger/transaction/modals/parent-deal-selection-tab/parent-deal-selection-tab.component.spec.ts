import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentDealSelectionTabComponent } from './parent-deal-selection-tab.component';

describe('ParentDealSelectionTabComponent', () => {
  let component: ParentDealSelectionTabComponent;
  let fixture: ComponentFixture<ParentDealSelectionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentDealSelectionTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentDealSelectionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
