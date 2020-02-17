import { Component, OnInit, Input } from '@angular/core';
import { Alert } from 'src/app/models/alert';
import { InventoryItem } from 'src/app/models/inventory-item';

@Component({
    selector: 'alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

    @Input() alerts: Alert[];
    @Input() inventoryItems: InventoryItem[];

    itemCountMap: Map<string, number>;
    activeAlerts: Alert[];


    constructor() {}

    ngOnInit(): void {
        this.determineActiveAlerts();
    }

    private determineActiveAlerts(): void {


        // Populate the item count map
        this.itemCountMap = new Map();
        this.inventoryItems.forEach(item => {
           if (this.itemCountMap.get(item.name)) {
                this.itemCountMap.set(item.name, this.itemCountMap.get(item.name) + 1);
           } else {
                this.itemCountMap.set(item.name, 1);
           }
        });
        console.log(this.itemCountMap);


        // determine active alerts
        this.activeAlerts = [];

        // TODO: Use filter() maybe.
        this.alerts.forEach(alert => {
            const alertAtQuantity = alert.reminderQuantity;
            alert.appliesToItems.forEach(alertItem => {
                // If the alert is for 'All Items' then we need to add some logic that checks
                // to see which inventory items are below that amount, and create specific alerts
                // for those items
                if(alertItem === 'All Items') {
                    this.itemCountMap.forEach((value, key) => {
                        if (value <= alertAtQuantity) {
                            const specificItemList = [key];
                            const alertToCreate = {
                                title: alert.title,
                                id: alert.id,
                                appliesToItems: specificItemList,
                                reminderQuantity: alertAtQuantity
                            };
                            this.activeAlerts.push(alertToCreate);
                        }
                    });
                } else if (this.itemCountMap.get(alertItem) && this.itemCountMap.get(alertItem) <= alertAtQuantity) {
                    // If the item is in the item count map and its count is under or equal to the alert quantity
                    this.activeAlerts.push(alert);
                }
            });
        });
    }

    /**
     * Removes the alert from the active alert list, hiding it from the user.
     * @param alertIndex
     */
    hideAlert(alertIndex: number) {
        this.activeAlerts.splice(alertIndex, 1);
    }
}
