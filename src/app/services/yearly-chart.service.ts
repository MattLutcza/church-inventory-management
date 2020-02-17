import { Injectable } from '@angular/core';
import { InventoryItem } from '../models/inventory-item';

export class ChartData {
  count: number;
  profit: number;
  cashflow: number;
  yearToDateCount: number;
  yearToDateProfit: number;
  yearToDateCashflow: number;
}

@Injectable()
export class YearlyChartService {

  // Data Initialized Flag
  private isDataInitialized: boolean;

  // Chart Data Map  
  private inventoryMonthAndYearMap: Map<string, Map<number, ChartData>>;

  // Chart Data
  private soldItemsChartData: any[];
  private profitChartData: any[];
  private cashInflowChartData: any[];
  private yScaleMaxForSoldItems: number;
  private yScaleMaxForProfit: number;
  private yScaleMaxForCashInflow: number;

  // Year-To-Date Chart Data
  private soldItemsYearToDateChartData: any[];
  private profitYearToDateChartData: any[];
  private cashInflowYearToDateChartData: any[];
  private yScaleMaxForYearToDateSoldItems: number;
  private yScaleMaxForYearToDateProfit: number;
  private yScaleMaxForYearToDateCashInflow: number; 

  constructor() { }

  get isChartDataInitialized() {
    return this.isDataInitialized;
  }

  get soldItemsCountChartData() {
    return this.soldItemsChartData;
  }

  get soldItemsProfitChartData() {
    return this.profitChartData;
  }

  get soldItemsCashInflowChartData() {
    return this.cashInflowChartData;
  }

  get soldItemsCountYearToDateChartData() {
    return this.soldItemsYearToDateChartData;
  }

  get soldItemsProfitYearToDateChartData() {
    return this.profitYearToDateChartData;
  }

  get soldItemsCashInflowYearToDateChartData() {
    return this.cashInflowYearToDateChartData;
  }

  get soldItemsCountChartMaxY() {
    return this.yScaleMaxForSoldItems;
  }

  get soldItemsProfitChartMaxY() {
    return this.yScaleMaxForProfit;
  }

  get soldItemsCashInflowChartMaxY() {
    return this.yScaleMaxForCashInflow;
  }

  get soldItemsCountYearToDateChartMaxY() {
    return this.yScaleMaxForYearToDateSoldItems;
  }

  get soldItemsProfitYearToDateChartMaxY() {
    return this.yScaleMaxForYearToDateProfit;
  }

  get soldItemsCashInflowYearToDateChartMaxY() {
    return this.yScaleMaxForYearToDateCashInflow;
  }

  determineColors(inventoryItems: InventoryItem[]): string[] {

    const colors: string[] = [];

    // Determine the number of colors needed.
    const endYear = new Date().getFullYear();
    const beginYear = this.determineEarliestSaleYear(inventoryItems);
    const numberOfColorsNeeded = endYear - beginYear + 1;

    // Actually come up with the colors.
    const lowerLimit = 0x10;
    const upperLimit = 0xE0;
    const colorStep = Math.floor((upperLimit - lowerLimit) / Math.pow(numberOfColorsNeeded, 1/3));

    for (let R = lowerLimit; R < upperLimit; R+=colorStep) {
      for (let G = lowerLimit; G < upperLimit; G+=colorStep) {
        for (let B = lowerLimit; B < upperLimit; B+=colorStep) {
          //The calculated step is not very precise, so this safeguard is appropriate
          if (colors.length >= numberOfColorsNeeded) {
            return colors;
          } else {
            const color = (R<<16)+(G<<8)+(B);
            colors.push('#' + color.toString(16));
          }
        }
      }
    }

    return colors;
  }

  /**
   * Given a list of inventory items, this function will group all the items sold into a double map based on
   * the month and year in which they were sold. The outer key being the month (January - December) they were
   * sold and the inner key being the year they were sold.
   * @param inventoryItems
   */
  constructInventoryMonthAndYearMap(inventoryItems: InventoryItem[]): void {
    // End year will be this current year.
    const endYear = new Date().getFullYear();
    const beginYear = this.determineEarliestSaleYear(inventoryItems);

    this.inventoryMonthAndYearMap = new Map;
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    for (let year = beginYear; year <= endYear; year = year + 1) {

      let yearToDateCount = 0;
      let yearToDateProfit = 0;
      let yearToDateCashflow = 0;
      for (let month = 0; month < 12; month = month + 1) {

        // Get all the items whose sell date match the month / year
        const itemsForYearAndMonth = inventoryItems.filter(item => {
          if (item.sellDate) {
            const sellDate = item.sellDate as Date;
            return sellDate.getFullYear() === year && sellDate.getMonth() === month;
          }
        });

        let count = 0;
        let profit = 0;
        let cashflow = 0;
        itemsForYearAndMonth.forEach(item => {
          count = count + 1;
          profit = profit + item.sellPrice - item.purchasePrice;
          cashflow = cashflow + item.sellPrice;
          yearToDateCount = yearToDateCount + 1;
          yearToDateProfit = yearToDateProfit + item.sellPrice - item.purchasePrice;
          yearToDateCashflow = yearToDateCashflow + item.sellPrice;
        });

        const charDataForMonth = {
          count: count,
          profit: profit, 
          cashflow: cashflow,
          yearToDateCount: yearToDateCount,
          yearToDateProfit: yearToDateProfit,
          yearToDateCashflow: yearToDateCashflow
        }

        if (this.inventoryMonthAndYearMap.get(monthNames[month])) {
          // If the month key does exist on the outer map, then we need to only add the new year data
          const yearDataForSpecificMonth = this.inventoryMonthAndYearMap.get(monthNames[month]) as Map<number, ChartData>;
          yearDataForSpecificMonth.set(year, charDataForMonth);
        } else {
          // If the month key doesn't exist on the outer map, then the year key definitely doesn't exist
          // on the inner map. Create a new inner map and add this specific year.
          const yearDataForSpecificMonth = new Map<number, ChartData>();
          yearDataForSpecificMonth.set(year, charDataForMonth);
          // Then attach it to the outer map based on the month.
          this.inventoryMonthAndYearMap.set(monthNames[month], yearDataForSpecificMonth);
        }
      }
    }
  }

  constructChartData(): void {
    // Initialize Chart Data Arrays
    this.soldItemsChartData = [];
    this.profitChartData = [];
    this.cashInflowChartData = [];
    this.soldItemsYearToDateChartData = [];
    this.profitYearToDateChartData = [];
    this.cashInflowYearToDateChartData = [];

    // Initialize Max Values
    let maxNumberItems = 0;
    let maxProfit = 0;
    let maxCashInflow = 0;
    let maxYearToDateNumberItems = 0;
    let maxYearToDateProfit = 0;
    let maxYearToDateCashInflow = 0;

    this.inventoryMonthAndYearMap.forEach((yearMap: Map<number, ChartData>, month) => {

      const soldItemsChartDataObject = {
        name: month,
        series: []
      };
      const profitChartDataObject = {
        name: month,
        series: []
      };
      const cashInflowChartDataObject = {
        name: month,
        series: []
      };

      const soldItemsYearToDateChartDataObject = {
        name: month,
        series: []
      };
      const profitYearToDateChartDataObject = {
        name: month,
        series: []
      };
      const cashInflowYearToDateChartDataObject = {
        name: month,
        series: []
      };
      
      yearMap.forEach((chartDataItem, year) => {

        soldItemsChartDataObject.series.push({
          name: year.toString(),
          value: chartDataItem.count
        });
        profitChartDataObject.series.push({
          name: year.toString(),
          value: chartDataItem.profit
        });
        cashInflowChartDataObject.series.push({
          name: year.toString(),
          value: chartDataItem.cashflow
        });

        soldItemsYearToDateChartDataObject.series.push({
          name: year.toString(),
          value: chartDataItem.yearToDateCount
        });

        profitYearToDateChartDataObject.series.push({
          name: year.toString(),
          value: chartDataItem.yearToDateProfit
        });

        cashInflowYearToDateChartDataObject.series.push({
          name: year.toString(),
          value: chartDataItem.yearToDateCashflow
        });

        // Check max values
        maxNumberItems = maxNumberItems < chartDataItem.count ? chartDataItem.count : maxNumberItems;
        maxProfit = maxProfit < chartDataItem.profit ? chartDataItem.profit : maxProfit;
        maxCashInflow = maxCashInflow < chartDataItem.cashflow ? chartDataItem.cashflow : maxCashInflow;
        maxYearToDateNumberItems = maxYearToDateNumberItems < chartDataItem.yearToDateCount ? chartDataItem.yearToDateCount : maxYearToDateNumberItems;
        maxYearToDateProfit = maxYearToDateProfit < chartDataItem.yearToDateProfit ? chartDataItem.yearToDateProfit : maxYearToDateProfit;
        maxYearToDateCashInflow = maxYearToDateCashInflow < chartDataItem.yearToDateCashflow ? chartDataItem.yearToDateCashflow : maxYearToDateCashInflow;
      });

      this.soldItemsChartData.push(soldItemsChartDataObject);
      this.profitChartData.push(profitChartDataObject);
      this.cashInflowChartData.push(cashInflowChartDataObject);
      this.soldItemsYearToDateChartData.push(soldItemsYearToDateChartDataObject);
      this.profitYearToDateChartData.push(profitYearToDateChartDataObject);
      this.cashInflowYearToDateChartData.push(cashInflowYearToDateChartDataObject);      
    });

    this.yScaleMaxForSoldItems = maxNumberItems * 1.25;
    this.yScaleMaxForProfit = maxProfit * 1.25;
    this.yScaleMaxForCashInflow = maxCashInflow * 1.25;
    this.yScaleMaxForYearToDateSoldItems = maxYearToDateNumberItems * 1.25;
    this.yScaleMaxForYearToDateProfit = maxYearToDateProfit * 1.25;
    this.yScaleMaxForYearToDateCashInflow = maxYearToDateCashInflow * 1.25;

    this.isDataInitialized = true;
  }

  /**
   * Given a list of inventory items, determine what the earliest sell date (year) is.
   * @param inventoryItems
   */
  private determineEarliestSaleYear(inventoryItems: InventoryItem[]) {
    // Start with this year
    let earliestYear = new Date().getFullYear();

    // Go through all the items and determine what the earliest sell date is
    inventoryItems.forEach(inventoryItem => {
      if (inventoryItem.sellDate) {
        const date = inventoryItem.sellDate as Date;
        if (date.getFullYear() < earliestYear) {
          earliestYear = date.getFullYear();
        }
      }
    });

    return earliestYear;
  }


}
