import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentitydocumentComponent } from './document-uploader.component';

describe('IdentitydocumentComponent', () => {
  let component: IdentitydocumentComponent;
  let fixture: ComponentFixture<IdentitydocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentitydocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentitydocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
