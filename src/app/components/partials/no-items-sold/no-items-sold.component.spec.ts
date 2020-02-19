import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoItemsSoldComponent } from './no-items-sold.component';

describe('NoItemsSoldComponent', () => {
  let component: NoItemsSoldComponent;
  let fixture: ComponentFixture<NoItemsSoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoItemsSoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoItemsSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
