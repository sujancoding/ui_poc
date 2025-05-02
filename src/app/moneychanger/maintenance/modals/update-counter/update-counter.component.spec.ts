import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCounterComponent } from './update-counter.component';

describe('UpdateCounterComponent', () => {
  let component: UpdateCounterComponent;
  let fixture: ComponentFixture<UpdateCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
