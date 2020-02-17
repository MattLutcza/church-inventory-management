import { Injectable } from '@angular/core';
import { Alert } from '../models/alert';

@Injectable()
export class AlertService {

  alerts: Alert[];

  constructor() { }

  /**
   * Retrieves the alerts
   */
  getAlerts(): Alert[] {
    if(this.alerts === undefined) {
      this.alerts = this.retrieveFakeAlerts();
    }
    return this.alerts;
  }

  /**
   * Saves any alert changes (add, edit, delete)
   * @param newAlerts
   */
  saveAlertChanges(newAlerts: Alert[]) {
    this.alerts = newAlerts;
  }

  private retrieveFakeAlerts() {
    // Create a fake alert based on the iventory item
    let alert = new Alert();
    alert.id = 1;
    alert.title = "Children's Gospel Alert";
    alert.appliesToItems = [];
    alert.appliesToItems.push("Children's Gospel");
    alert.reminderQuantity = 5;
    this.alerts = [];
    this.alerts.push(alert);
    // return the fake alert list
    return this.alerts;
  }

}
