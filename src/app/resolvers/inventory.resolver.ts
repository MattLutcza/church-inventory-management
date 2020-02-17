import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory-item';

@Injectable()
export class InventoryResolver implements Resolve<InventoryItem[]> {

    constructor(private inventorySerice: InventoryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): InventoryItem[] {
        return this.inventorySerice.getInventoryItems();
    }
}
