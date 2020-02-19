import { Injectable } from '@angular/core';
import { InventoryItem } from '../models/inventory-item';

@Injectable()
export class InventoryService {

    inventoryItems: InventoryItem[];

    constructor() {}

    addNewInventoryItems(newItems: InventoryItem[]): void {
        this.inventoryItems.push(...newItems);
    }

    markInventoryItemsSold(id, sellDate, sellMethod, sellPrice: number): void {
        const item = this.inventoryItems.filter(inventoryItem => {
            if (inventoryItem.id === id) {
                return inventoryItem;
            }
        })[0];
        const index = this.inventoryItems.indexOf(item);
        this.inventoryItems[index].sellDate = sellDate;
        this.inventoryItems[index].sellMethod = sellMethod;
        this.inventoryItems[index].sellPrice = sellPrice;
    }

    getInventoryItems(): InventoryItem[] {
        if(this.inventoryItems === undefined) {
            this.inventoryItems = []; // this.retrieveFakeInventory();
        }
        return this.inventoryItems;
    }

    private retrieveFakeInventory(): InventoryItem[] {
        const inventoryItems = [
            {
                name: 'Gospel',
                id: 1,
                category: 'Books',
                subcategory: 'Adult Books',
                supplier: 'Books A Million',
                donated: 'Yes',
                purchaseDate: new Date(2019,9,15),
                purchasePrice: 24.99,
                taxAndShippingPrice: 1.49,
                sellDate: new Date(2019,10,25),
                sellPrice: 29.99,
                sellMethod: 'Cash'
            },
            {
                name: 'Cross Necklace',
                id: 2,
                category: 'Jewerly',
                subcategory: 'Necklace',
                supplier: 'Zales',
                donated: 'Yes',
                purchaseDate: new Date(2019,9,15),
                purchasePrice: 34.99,
                taxAndShippingPrice: 1.99,
                sellDate: new Date(2019,11,15),
                sellPrice: 49.99,
                sellMethod: 'Credit'
            },
            {
                name: 'Children\'s Gospel',
                id: 3,
                category: 'Books',
                subcategory: 'Children\'s Books',
                supplier: 'Barnes And Nobles',
                donated: 'Yes',
                purchaseDate: new Date(2019,9,13),
                purchasePrice: 19.99,
                taxAndShippingPrice: 1.19,
                sellDate: new Date(2020,0,12),
                sellPrice: 29.99,
                sellMethod: 'Cash'
            },
            {
                name: 'Children\'s Gospel',
                id: 4,
                category: 'Books',
                subcategory: 'Children\'s Books',
                supplier: 'Barnes And Nobles',
                donated: 'No',
                purchaseDate: new Date(2019,8,17),
                purchasePrice: 19.99,
                taxAndShippingPrice: 1.19,
                sellDate: new Date(2019,10,9),
                sellPrice: 29.99,
                sellMethod: 'Cash'
            },
            {
                name: 'Cross Necklace',
                id: 5,
                category: 'Jewerly',
                subcategory: 'Necklace',
                supplier: 'Zales',
                donated: 'No',
                purchaseDate: new Date(2019,8,12),
                purchasePrice: 34.99,
                taxAndShippingPrice: 1.99,
                sellDate: new Date(2019,8,29),
                sellPrice: 49.99,
                sellMethod: 'Check'
            },
            {
                name: 'Cross Necklace',
                id: 7,
                category: 'Jewerly',
                subcategory: 'Necklace',
                supplier: 'Zales',
                donated: 'No',
                purchaseDate: new Date(2019,8,13),
                purchasePrice: 34.99,
                taxAndShippingPrice: 1.99,
                sellPrice: 49.99
            },
            {
                name: 'Cross Necklace',
                id: 15,
                category: 'Jewerly',
                subcategory: 'Necklace',
                supplier: 'Zales',
                donated: 'No',
                purchaseDate: new Date(2020,0,17),
                purchasePrice: 34.99,
                taxAndShippingPrice: 1.99,
                sellPrice: 49.99
            },
            {
                name: 'Cross Necklace',
                id: 25,
                category: 'Jewerly',
                subcategory: 'Necklace',
                supplier: 'Readin Jewelry',
                donated: 'Yes',
                purchaseDate: new Date(2019,11,17),
                purchasePrice: 34.99,
                taxAndShippingPrice: 1.99,
                sellPrice: 49.99
            },
            {
                name: 'Children\'s Gospel',
                id: 35,
                category: 'Books',
                subcategory: 'Children\'s Books',
                supplier: 'Books.com',
                donated: 'Yes',
                purchaseDate: new Date(2019,11,19),
                purchasePrice: 19.99,
                taxAndShippingPrice: 1.19,
                sellPrice: 29.99
            },
            {
                name: 'Children\'s Gospel',
                id: 13,
                category: 'Books',
                subcategory: 'Children\'s Books',
                supplier: 'Books.com',
                donated: 'Yes',
                purchaseDate: new Date(2019,7,27),
                purchasePrice: 19.99,
                taxAndShippingPrice: 1.19,
                sellDate: new Date(2019,11,19),
                sellPrice: 29.99,
                sellMethod: 'Check'
            },
            {
                name: 'Children\'s Gospel',
                id: 50,
                category: 'Books',
                subcategory: 'Children\'s Books',
                supplier: 'Books.com',
                donated: 'Yes',
                purchaseDate: new Date(2019,0,27),
                purchasePrice: 19.99,
                taxAndShippingPrice: 1.19,
                sellDate: new Date(2019,0,29),
                sellPrice: 29.99,
                sellMethod: 'Check'
            },
            {
                name: 'Lotion',
                id: 51,
                category: 'Self Care',
                subcategory: 'Lotion',
                supplier: 'lotions.com',
                donated: 'Yes',
                purchaseDate: new Date(2019,0,20),
                purchasePrice: 9.99,
                taxAndShippingPrice: 1.19,
                sellDate: new Date(2019,0,30),
                sellPrice: 15.99,
                sellMethod: 'Cash'
            },
            {
                name: 'Lotion',
                id: 52,
                category: 'Self Care',
                subcategory: 'Lotion',
                supplier: 'lotions.com',
                donated: 'Yes',
                purchaseDate: new Date(2018,0,10),
                purchasePrice: 9.99,
                taxAndShippingPrice: 1.19,
                sellDate: new Date(2018,0,20),
                sellPrice: 15.99,
                sellMethod: 'Cash'
            },
            {
                name: 'Gospel',
                id: 53,
                category: 'Books',
                subcategory: 'Adult Books',
                supplier: 'Books.com',
                donated: 'Yes',
                purchaseDate: new Date(2018,11,27),
                purchasePrice: 19.99,
                taxAndShippingPrice: 1.19,
                sellDate: new Date(2018,11,29),
                sellPrice: 29.99,
                sellMethod: 'Check'
            },
        ];

        return inventoryItems;
    }

}
