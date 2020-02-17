import { Component, Input, OnInit } from '@angular/core';

import { InventoryItem } from 'src/app/models/inventory-item';

@Component({
    selector: 'latest-bought',
    templateUrl: './latest-bought.component.html',
    styleUrls: ['./latest-bought.component.scss']
})
export class LatestBoughtComponent implements OnInit {

    @Input()
    inventoryItems: InventoryItem[];

    numberOfPurchasesToDisplay: number;
    latestPurchases: InventoryItem[];

    constructor() {}

    ngOnInit(): void {
        this.numberOfPurchasesToDisplay = 5;
        this.latestPurchases = this.retrieveLatestPurchasedItems();
    }

    retrieveLatestPurchasedItems(): InventoryItem[] {
        const latestPurchases = [];

        this.inventoryItems.sort((item1, item2) => {
            if (item1.purchaseDate > item2.purchaseDate) {
                return 1;
            } else if (item1.purchaseDate < item2.purchaseDate) {
                return -1;
            } else {
                return 0;
            }
        }).reverse();

        for(let counter = 0; counter < this.numberOfPurchasesToDisplay; counter = counter + 1) {
            latestPurchases.push(this.inventoryItems[counter]);
        }

        return latestPurchases;
    }
}
