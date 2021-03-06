import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YearlyChartService } from 'src/app/services/yearly-chart.service';
import { InventoryItem } from 'src/app/models/inventory-item';

@Component({
  selector: 'app-statistics',
  templateUrl: './yearly-count-statistics.component.html',
  styleUrls: ['./yearly-count-statistics.component.scss']
})
export class YearlyCountStatisticsComponent implements OnInit {

  // Chart data
  soldItemsChartData: any[];
  yScaleMaxForNumItems: number;
  soldItemsYearToDateChartData: any[];
  yScaleMaxForYearToDateNumItems: number;

  // Other chart options
  chartSize;
  colorScheme;

  hasSoldItems: boolean;

  constructor(private route: ActivatedRoute, private yearlyChartService: YearlyChartService) {
    this.chartSize = this.yearlyChartService.calculateChartSize();   
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.hasSoldItems = this.checkIfAnyItemsAreSold(data.inventoryItems);
      // Only setup chart if there are sold items.
      if (this.hasSoldItems) {
        // If the yearly chart service didn't parse/create the chart data yet, we need to do that.
        if (!this.yearlyChartService.isChartDataInitialized) {
          this.yearlyChartService.constructInventoryMonthAndYearMap(data.inventoryItems);
          this.yearlyChartService.constructChartData();
        }
        this.soldItemsChartData = this.yearlyChartService.soldItemsCountChartData;
        this.yScaleMaxForNumItems = this.yearlyChartService.soldItemsCountChartMaxY;
        this.soldItemsYearToDateChartData = this.yearlyChartService.soldItemsCountYearToDateChartData;
        this.yScaleMaxForYearToDateNumItems = this.yearlyChartService.soldItemsCountYearToDateChartMaxY;
        this.colorScheme = {
          domain: this.yearlyChartService.determineColors(data.inventoryItems)
        };
      }
    });
  }

  private checkIfAnyItemsAreSold(inventoryItems: InventoryItem[]) {
    return inventoryItems.filter((item) => {
      if (item.sellDate) {
        return item;
      }
    }).length > 0;
  }

  onResize(event) {
    this.chartSize = this.yearlyChartService.calculateChartSize(event);
  }
}
