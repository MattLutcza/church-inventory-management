import { Component, OnInit } from '@angular/core';
import { InventoryItem } from 'src/app/models/inventory-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-items-in-stock',
  templateUrl: './items-in-stock.component.html',
  styleUrls: ['./items-in-stock.component.scss']
})
export class ItemsInStockComponent implements OnInit {

  inventoryItemQuantities: Map<string, number>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.inventoryItemQuantities = this.determineItemQuantities(data.inventoryItems);
    });
  }

  // TODO: Used in two places.
  private determineItemQuantities(inventoryItems: InventoryItem[]): Map<string, number> {
    let itemQuantities = new Map<string, number>();
    for(let counter = 0; counter < inventoryItems.length; counter++) {
        const item = inventoryItems[counter];
        if (item.sellDate) {
            if (itemQuantities.get(item.name)) {
                itemQuantities.set(item.name, itemQuantities.get(item.name) + 1);
            } else {
                itemQuantities.set(item.name, 1);
            }
        }
    }
    return itemQuantities;
  }

}
