import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePayeeComponent } from './approve-payee.component';

describe('ApprovePayeeComponent', () => {
  let component: ApprovePayeeComponent;
  let fixture: ComponentFixture<ApprovePayeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovePayeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovePayeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
