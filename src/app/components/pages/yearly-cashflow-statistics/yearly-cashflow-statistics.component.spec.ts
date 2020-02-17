import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyCashflowStatisticsComponent } from './yearly-cashflow-statistics.component';

describe('YearlyCashflowStatisticsComponent', () => {
  let component: YearlyCashflowStatisticsComponent;
  let fixture: ComponentFixture<YearlyCashflowStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearlyCashflowStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyCashflowStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
