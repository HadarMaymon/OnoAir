import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDestinationsComponent } from './edit-destinations.component';

describe('EditDestinationsComponent', () => {
  let component: EditDestinationsComponent;
  let fixture: ComponentFixture<EditDestinationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDestinationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
