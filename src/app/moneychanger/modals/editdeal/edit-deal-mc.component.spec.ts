import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDealMcComponent } from './edit-deal-mc.component';

describe('EditDealMcComponent', () => {
  let component: EditDealMcComponent;
  let fixture: ComponentFixture<EditDealMcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDealMcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDealMcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
