import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarsReviewComponent } from './stars-review.component';

describe('StarsReviewComponent', () => {
  let component: StarsReviewComponent;
  let fixture: ComponentFixture<StarsReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarsReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
