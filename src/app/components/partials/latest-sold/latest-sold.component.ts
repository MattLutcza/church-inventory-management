import { Component, OnInit, Input } from '@angular/core';
import { InventoryItem } from 'src/app/models/inventory-item';

@Component({
    selector: 'latest-sold',
    templateUrl: './latest-sold.component.html',
    styleUrls: ['./latest-sold.component.scss']
})
export class LatestSoldComponent implements OnInit {

    @Input()
    inventoryItems: InventoryItem[];

    numberOfSalesToDisplay: number;
    latestSales: InventoryItem[];

    constructor() {}

    ngOnInit(): void {
        this.numberOfSalesToDisplay = 5;
        this.latestSales = this.retrieveLatestSoldItems();
    }

    retrieveLatestSoldItems(): InventoryItem[] {
        const latestSales = [];
        console.log(this.inventoryItems);
        const inventoryItemsCopy = [...this.inventoryItems];
        inventoryItemsCopy.sort((item1, item2) => {

            if (!item1.sellDate) {
                item1.sellDate = null;
            }
            
            if (!item2.sellDate) {
                item2.sellDate = null;
            }

            if (item1.sellDate > item2.sellDate) {
                return 1;
            } else if (item1.sellDate < item2.sellDate) {
                return -1;
            } else {
                return 0;
            }
        }).reverse();

        for(let counter = 0; counter < this.numberOfSalesToDisplay; counter = counter + 1) {
            if(inventoryItemsCopy[counter].sellDate) {
                latestSales.push(inventoryItemsCopy[counter]);
            }
        }

        console.log(this.inventoryItems);

        return latestSales;
    }
}
