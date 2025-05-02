import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPayeeComponent } from './all-payee.component';

describe('AllPayeeComponent', () => {
  let component: AllPayeeComponent;
  let fixture: ComponentFixture<AllPayeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPayeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPayeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
