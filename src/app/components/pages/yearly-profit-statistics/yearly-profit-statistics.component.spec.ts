import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyProfitStatisticsComponent } from './yearly-profit-statistics.component';

describe('YearlyProfitStatisticsComponent', () => {
  let component: YearlyProfitStatisticsComponent;
  let fixture: ComponentFixture<YearlyProfitStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearlyProfitStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyProfitStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
