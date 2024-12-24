import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookingsDetailsComponent } from './my-bookings-details.component';

describe('MyBookingsDetailsComponent', () => {
  let component: MyBookingsDetailsComponent;
  let fixture: ComponentFixture<MyBookingsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBookingsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBookingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
