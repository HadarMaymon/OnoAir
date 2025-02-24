import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastMinuteFlightComponent } from './last-minute-flight.component';

describe('LastMinuteFlightComponent', () => {
  let component: LastMinuteFlightComponent;
  let fixture: ComponentFixture<LastMinuteFlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastMinuteFlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastMinuteFlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
