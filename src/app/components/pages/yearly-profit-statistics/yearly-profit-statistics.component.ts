import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YearlyChartService } from 'src/app/services/yearly-chart.service';
import { InventoryItem } from 'src/app/models/inventory-item';

@Component({
  selector: 'app-yearly-profit-statistics',
  templateUrl: './yearly-profit-statistics.component.html',
  styleUrls: ['./yearly-profit-statistics.component.scss']
})
export class YearlyProfitStatisticsComponent implements OnInit {

  // Chart data
  profitChartData: any[];
  yScaleMaxForProfit: number;
  profitYearToDateChartData: any[];
  yScaleMaxForYearToDateProfit: number;

  // Other chart options
  chartSize;
  colorScheme;

  hasSoldItems: boolean;

  constructor(private route: ActivatedRoute, private yearlyChartService: YearlyChartService) {
    this.chartSize = [innerWidth / 1.1, 500];
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
        this.profitChartData = this.yearlyChartService.soldItemsProfitChartData;
        this.yScaleMaxForProfit = this.yearlyChartService.soldItemsProfitChartMaxY;
        this.profitYearToDateChartData = this.yearlyChartService.soldItemsProfitYearToDateChartData;
        this.yScaleMaxForYearToDateProfit = this.yearlyChartService.soldItemsProfitYearToDateChartMaxY;
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
    this.chartSize = [event.target.innerWidth / 1.1, 500];
  }

}

//TODO: Year To Date