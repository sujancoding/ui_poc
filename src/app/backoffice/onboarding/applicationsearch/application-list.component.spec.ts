import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesktopBranchComponent } from './applicationsearch.component';

describe('DesktopBranchComponent', () => {
  let component: DesktopBranchComponent;
  let fixture: ComponentFixture<DesktopBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesktopBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesktopBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
