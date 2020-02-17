import { Component, OnInit, Input } from '@angular/core';

import { InventoryItem } from 'src/app/models/inventory-item';
import { PageChangedEvent } from 'ngx-bootstrap/pagination/ngx-bootstrap-pagination';

@Component({
    selector: 'inventory',
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

    // See below note on maybe making this better
    sortMap: Map<string, string>;

    @Input()
    inventoryItems: InventoryItem[];

    displayableInventoryItems: InventoryItem[];
    tableItems: InventoryItem[];
    displaySelection: string;

    searchCriteria: string;
    todayDate: Date;

    itemsPerPage: number;
    numberOfPages: number;

    constructor() {
        this.itemsPerPage = 10;
    }

    ngOnInit(): void {
        this.todayDate = new Date();
        this.displaySelection = 'All Items';
        this.displayableInventoryItems = [...this.inventoryItems];
        this.numberOfPages = Math.ceil(this.displayableInventoryItems.length / this.itemsPerPage);
        this.tableItems = this.displayableInventoryItems.slice(0, 10);
        this.initializeSortMap();
    }

    // TODO: Do this sorting (ascending / descending) thing better.
    // Example: https://www.carbonatethis.com/sort-table-columns-with-angular-and-typescript/
    // Note: Could also use ng-bootstrap module. Sorting / Filtering comes built in.
    // https://ng-bootstrap.github.io/#/components/table/overview

    /**
     * Initialize the sort map so that we can keep track of how to sort (ascending or descending).
     */
    private initializeSortMap(): void {
        this.sortMap = new Map<string, string>();
        this.sortMap.set('id', 'desc');
        this.sortMap.set('name', 'desc');
        this.sortMap.set('category', 'desc');
        this.sortMap.set('subcategory', 'desc');
        this.sortMap.set('supplier', 'desc');
        this.sortMap.set('itemCost', 'desc');
        this.sortMap.set('taxShipping', 'desc');
        this.sortMap.set('sellingPrice', 'desc');
        this.sortMap.set('purchaseDate', 'desc');
        this.sortMap.set('sellDate', 'desc');
        this.sortMap.set('sellMethod', 'desc');
    }

    /**
     *
     */
    changeDisplayedItems(): void {
        if(this.displaySelection === 'All Items') {
            this.displayableInventoryItems = [...this.inventoryItems];
        } else if(this.displaySelection === 'Unsold Items') {
            this.displayableInventoryItems = this.getUnsoldItems(this.inventoryItems);
        } else if(this.displaySelection === 'Sold Items') {
            this.displayableInventoryItems = this.getSoldItems(this.inventoryItems);
        }
        this.tableItems = this.displayableInventoryItems.slice(0, 10);
    }

    /**
     * Filters out and returns a new list containing only the unsold items
     * @param inventoryItems
     */
    private getUnsoldItems(inventoryItems: InventoryItem[]) {
        return inventoryItems.filter(item => {
            // If there is no sell date, then the item hasn't sold yet.
            if(!item.sellDate) {
                return item;
            }
        });
    }

    /**
     * Filters out and returns a new list containing only the sold items
     * @param inventoryItems
     */
    private getSoldItems(inventoryItems: InventoryItem[]) {
        return inventoryItems.filter(item => {
            // If there is a sell date, then the item has already sold.
            if(item.sellDate) {
                return item;
            }
        });
    }


    private treatAsUTC(date): Date {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    /**
     *
     * @param startDate
     * @param endDate
     */
    determineDaysBetweenDates(startDate, endDate): number {
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const endTimeUTC = this.treatAsUTC(endDate).getTime();
        const startTimeUTC = this.treatAsUTC(startDate).getTime();
        return Math.round((endTimeUTC - startTimeUTC) / millisecondsPerDay);
    }

    /**
     *
     */
    calculateMarkUpPercent(sellPrice: number, purchasePrice: number): number {
        return (sellPrice - purchasePrice) / purchasePrice;
    }

    // TODO: This is trash. Redo how we sort.
    /**
     *
     */
    sortBy(sortByMethod: string): void {
        if(sortByMethod === 'id') {
            if(this.sortMap.get(sortByMethod) === 'asc') {
                this.sortMap.set(sortByMethod, 'desc');
                this.displayableInventoryItems.sort((item1, item2) => {
                    if(item1.id > item2.id) {
                        return 1;
                    } else if(item1.id < item2.id) {
                        return -1;
                    } else {
                        return 0;
                    }
                });
            } else {
                this.sortMap.set(sortByMethod, 'asc');
                this.displayableInventoryItems.sort((item1, item2) => {
                    if(item1.id > item2.id) {
                        return 1;
                    } else if(item1.id < item2.id) {
                        return -1;
                    } else {
                        return 0;
                    }
                }).reverse();
            }
        } else if (sortByMethod === 'name') {
            if(this.sortMap.get(sortByMethod) === 'asc') {
                this.sortMap.set(sortByMethod, 'desc');
                this.displayableInventoryItems.sort(function (item1, item2) {
                    return item1.name.localeCompare(item2.name, 'en', {'sensitivity': 'base'});
                });
            } else {
                this.sortMap.set(sortByMethod, 'asc');
                this.displayableInventoryItems.sort(function (item1, item2) {
                    return item1.name.localeCompare(item2.name, 'en', {'sensitivity': 'base'});
                }).reverse();
            }
        } else if (sortByMethod === 'sellDate') {

        }
    }

    // TODO: Add a asc / desc symbol to each column head? This will be the trigger to sort.
    // TODO: The column header title will trigger a 'filter layer' allowing the user to select which items get displayed.
    // TODO: Add pagination? If easy. NOTE: ng-bootstrap comes built in with pagination


    pageChanged(event: PageChangedEvent): void {        
        const startItem = (event.page - 1) * event.itemsPerPage;
        const endItem = event.page * event.itemsPerPage;
        this.tableItems = this.displayableInventoryItems.slice(startItem, endItem);
    }

}
