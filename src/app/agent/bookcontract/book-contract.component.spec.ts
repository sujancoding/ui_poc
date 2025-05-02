import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookContractComponent } from './book-contract.component';

describe('BookContractComponent', () => {
  let component: BookContractComponent;
  let fixture: ComponentFixture<BookContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
