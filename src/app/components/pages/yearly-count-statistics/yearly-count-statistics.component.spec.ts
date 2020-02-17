import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyCountStatisticsComponent } from './yearly-count-statistics.component';

describe('YearlyCountStatisticsComponent', () => {
  let component: YearlyCountStatisticsComponent;
  let fixture: ComponentFixture<YearlyCountStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearlyCountStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyCountStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
