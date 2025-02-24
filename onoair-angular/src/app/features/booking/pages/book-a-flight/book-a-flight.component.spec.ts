import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAFlightComponent } from './book-a-flight.component';

describe('BookAFlightComponent', () => {
  let component: BookAFlightComponent;
  let fixture: ComponentFixture<BookAFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookAFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
