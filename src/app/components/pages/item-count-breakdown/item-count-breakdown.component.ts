import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryItem } from 'src/app/models/inventory-item';

export class ItemData {
  quantity: number;
  profit: number;
  cashInflow: number;
}

export class ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-item-count-breakdown',
  templateUrl: './item-count-breakdown.component.html',
  styleUrls: ['./item-count-breakdown.component.scss']
})
export class ItemCountBreakdownComponent implements OnInit {

  single: any[];

  view: any[] = [700, 400];

  years = [];
  yearData = {};
  currentYear;

  // options
  showLegend = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;

  yearlyItemDataMap: Map<string, Map<string, ItemData>>;
  yearlyItemChartDataMap: Map<string, any[]>

  hasSoldItems: boolean;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.hasSoldItems = this.checkIfAnyItemsAreSold(data.inventoryItems);
      this.gatherItemData(data.inventoryItems);
      this.createChartData();
    });
    this.currentYear = new Date().getFullYear().toString();
  }

  private checkIfAnyItemsAreSold(inventoryItems: InventoryItem[]) {
    return inventoryItems.filter((item) => {
      if (item.sellDate) {
        return item;
      }
    }).length > 0;
  }

  private gatherItemData(inventoryItems: InventoryItem[]) {
    this.yearlyItemDataMap = new Map<string, Map<string, ItemData>>();

    const totalDataMap = new Map<string, ItemData>();

    this.yearlyItemDataMap.set('total', totalDataMap);

    for(let counter = 0; counter < inventoryItems.length; counter = counter + 1) {
      const item = inventoryItems[counter];

      // Only gather data for items with a sell date.
      if(item.sellDate) {

        // Add the data to the total map first.
        const totalItemMap = this.yearlyItemDataMap.get('total');

        // If an item entry already exists, add to it.
        if(totalItemMap.get(item.name)) {
          const itemData = totalItemMap.get(item.name);
          itemData.quantity = itemData.quantity + 1;
          itemData.profit = itemData.profit + (item.sellPrice - item.purchasePrice);
          itemData.cashInflow = itemData.cashInflow + item.sellPrice;
        } else {
          // Otherwise, create a new entry for the item.
          const itemData = {
            quantity: 1,
            profit: item.sellPrice - item.purchasePrice,
            cashInflow: item.sellPrice
          }
          totalItemMap.set(item.name, itemData);
        }

        // Then place the item data in the specific year it belongs to.
        const sellDate = item.sellDate as Date;
        const year = sellDate.getFullYear().toString();
        if(!this.years.includes(year)) {
          this.years.push(year);
        }

        // If the year key already has a map in it, we just need to add to it
        if (this.yearlyItemDataMap.get(year)) {
          const itemMapForYear = this.yearlyItemDataMap.get(year);

          if (itemMapForYear.get(item.name)) {
            const itemData = itemMapForYear.get(item.name);
            itemData.quantity = itemData.quantity + 1;
            itemData.profit = itemData.profit + (item.sellPrice - item.purchasePrice);
            itemData.cashInflow = itemData.cashInflow + item.sellPrice;
            itemMapForYear.set(item.name, itemData);
          } else {
            const itemData = {
              quantity: 1,
              profit: item.sellPrice - item.purchasePrice,
              cashInflow: item.sellPrice
            }
            itemMapForYear.set(item.name, itemData);
          }

        } else {
          // If the year key doesn't have a map valued yet, then create a new one.
          const itemMapForYear = new Map<string, ItemData>();
          const itemData = {
            quantity: 1,
            profit: item.sellPrice - item.purchasePrice,
            cashInflow: item.sellPrice
          }
          itemMapForYear.set(item.name, itemData);
          this.yearlyItemDataMap.set(year, itemMapForYear);
        }
      }
    }

    // Sort the years afterwards
    this.years.sort((item1, item2) => {
      const year1 = Number(item1);
      const year2 = Number(item2);

      if (year1 > year2) {
        return 1;
      } else if(year1 < year2) {
        return -1;
      }
      return 0;
    });
  }

  private createChartData() {
    this.yearlyItemDataMap.forEach((itemDataMap: Map<string, ItemData>, year: string) => {
      const itemQuantityListForYear = [];
      itemDataMap.forEach((itemData: ItemData, itemName: string) => {
        // We will include the quantity in the legend for readability.
        const formattedName = itemName + ' (' + itemData.quantity + ')';
        const chartDataItem = {
          name: formattedName,
          value: itemData.quantity
        }
        itemQuantityListForYear.push(chartDataItem);
      });
      this.yearData[year] = itemQuantityListForYear;
    });
  }

}
