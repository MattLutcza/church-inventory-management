import { TestBed } from '@angular/core/testing';

import { YearlyChartService } from './yearly-chart.service';

describe('YearlyChartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YearlyChartService = TestBed.get(YearlyChartService);
    expect(service).toBeTruthy();
  });
});
