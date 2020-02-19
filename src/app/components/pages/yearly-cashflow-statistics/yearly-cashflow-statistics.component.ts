import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YearlyChartService } from 'src/app/services/yearly-chart.service';
import { InventoryItem } from 'src/app/models/inventory-item';

@Component({
  selector: 'app-yearly-cashflow-statistics',
  templateUrl: './yearly-cashflow-statistics.component.html',
  styleUrls: ['./yearly-cashflow-statistics.component.scss']
})
export class YearlyCashflowStatisticsComponent implements OnInit {

    // Chart data
    cashInflowChartData: any[];
    yScaleMaxForCashInflow: number;
    cashInflowYearToDateChartData: any[];
    yScaleMaxForYearToDateCashInflow: number;

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
          this.cashInflowChartData = this.yearlyChartService.soldItemsCashInflowChartData;
          this.yScaleMaxForCashInflow = this.yearlyChartService.soldItemsCashInflowChartMaxY;
          this.cashInflowYearToDateChartData = this.yearlyChartService.soldItemsCashInflowYearToDateChartData;
          this.yScaleMaxForYearToDateCashInflow = this.yearlyChartService.soldItemsCashInflowYearToDateChartMaxY;
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
