import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicreportComponent } from './basicreport.component';

describe('BasicreportComponent', () => {
  let component: BasicreportComponent;
  let fixture: ComponentFixture<BasicreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
