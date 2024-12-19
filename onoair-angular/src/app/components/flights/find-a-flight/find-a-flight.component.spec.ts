import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAFlightComponent } from './find-a-flight.component';

describe('FindAFlightComponent', () => {
  let component: FindAFlightComponent;
  let fixture: ComponentFixture<FindAFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindAFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FindAFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
