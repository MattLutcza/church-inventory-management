import { Component } from '@angular/core';
import { Alert } from 'src/app/models/alert';
import { ActivatedRoute } from '@angular/router';
import { InventoryItem } from 'src/app/models/inventory-item';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    alerts: Alert[];
    inventoryItems: InventoryItem[];

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.alerts = data.inventoryAlerts;
            this.inventoryItems = data.inventoryItems;
        });
    }

}
