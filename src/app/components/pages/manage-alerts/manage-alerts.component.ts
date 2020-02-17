import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Alert } from 'src/app/models/alert';
import { AlertService } from 'src/app/services/alert.service';
import { InventoryItem } from 'src/app/models/inventory-item';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage-alerts',
  templateUrl: './manage-alerts.component.html',
  styleUrls: ['./manage-alerts.component.scss']
})
export class ManageAlertsComponent implements OnInit {

  modalRef: BsModalRef;
  modalAlertIndex: number;

  alerts: Alert[];

  alertForm: FormGroup;

  appliesToItemSelections: string[];
  possibleItemSelections: string[];

  private inventoryItems: InventoryItem[];

  constructor(private modalService: BsModalService, private alertService: AlertService,
      private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  /**
   * Creates a new, empty form group for the add alert layer.
   */
  private initializeAlertsForm(): void {
    this.alertForm = this.formBuilder.group({
      alertTitle: new FormControl('', Validators.required),
      altertForItem: new FormControl(''),
      alertAtQuantity: new FormControl('', [Validators.required, Validators.min(1)])
    });
  }

  /**
   * Creates a new, form group for the edit alert layer with initial values based on the alert passed in.
   */
  private initializeAlertsFormWithValues(alert: Alert): void {
    this.alertForm = this.formBuilder.group({
      alertTitle: new FormControl(alert.title, Validators.required),
      altertForItem: new FormControl(''),
      alertAtQuantity: new FormControl(alert.reminderQuantity, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.alerts = data.inventoryAlerts;
      this.inventoryItems = data.inventoryItems;
      this.possibleItemSelections = this.initializeItemSelections(this.inventoryItems);
    });
  }

  /**
   *
   * @param inventoryItems
   */
  private initializeItemSelections(inventoryItems: InventoryItem[]) {
    // only allow the user to create alerts from the unsold items
    const unsoldInventoryItems = this.getUnsoldInventoryItems(inventoryItems);

    // initialize the item selections
    const itemSelections = [];
    itemSelections.push('All Items'); // Allow an alert to be applied to 'All Items'
    itemSelections.push(...new Set(this.getItemNames(unsoldInventoryItems))); // Use a Set to remove duplicates
    return itemSelections;
  }

  /**
   * Retrieves the items that do not have a sell date (they are not sold yet)
   * @param inventoryItems
   */
  private getUnsoldInventoryItems(inventoryItems: InventoryItem[]): InventoryItem[] {
    return inventoryItems.filter((inventoryItem: InventoryItem) => {
      return inventoryItem.sellDate === undefined || inventoryItem.sellDate === 'N/A';
    });
  }

  /**
   * Maps the list of inventory items to a list of item names (as strings)
   * @param inventoryItems
   */
  private getItemNames(inventoryItems: InventoryItem[]): string[] {
    return inventoryItems.map(inventoryItem => {
      return inventoryItem.name;
    });
  }

  /**
   *
   * @param template
   * @param alertIndex
   */
  openModal(template: TemplateRef<any>, alertIndex?: number) {
    if (alertIndex !== undefined) {
      this.modalAlertIndex = alertIndex;
    }
    this.modalRef = this.modalService.show(template);
  }

  openAddAlertLayer(template: TemplateRef<any>) {
    // Initialize the form and any input values
    this.initializeAlertsForm();
    this.appliesToItemSelections = [];
    this.possibleItemSelections = this.initializeItemSelections(this.inventoryItems);

    // Open the layer
    this.modalRef = this.modalService.show(template);
  }

  /**
   * Handles the logic that occurs when the user wants to edit an alert
   * @param template
   * @param alertIndex
   */
  openEditAlertLayer(template: TemplateRef<any>, alertIndex: number) {
    // Set the alert index so it can be used later
    this.modalAlertIndex = alertIndex;

    // Initialize the form values to what the alert values
    this.initializeAlertsFormWithValues(this.alerts[this.modalAlertIndex]);

    // Initialize as a COPY of the current alert values
    this.appliesToItemSelections = [...this.alerts[this.modalAlertIndex].appliesToItems];

    // Filter out any pre selected items from the possible item selection list
    this.possibleItemSelections = this.initializeItemSelections(this.inventoryItems);
    this.appliesToItemSelections.forEach(itemSelection => {
      const index = this.possibleItemSelections.indexOf(itemSelection);
      this.possibleItemSelections.splice(index, 1);
    });

    // Open the layer
    this.modalRef = this.modalService.show(template);
  }

  /**
   * Closes the current layer that is open
   */
  closeModal() {
    this.modalRef.hide();
  }

  /**
   * Deletes an alert and removes it from being displayed
   * @param alertIndex
   */
  deleteAlert(alertIndex: number) {
    this.alerts.splice(alertIndex, 1);
    this.alertService.saveAlertChanges(this.alerts);
    this.closeModal();
  }

  /**
   *
   */
  handleApplyToItemSelection(): void {
    const alertForItemsFormControl = this.alertForm.controls.altertForItem as FormControl;
    const alertForItem: string = alertForItemsFormControl.value;

    // Only add the item if it is one of the possible selections
    if (this.possibleItemSelections.indexOf(alertForItem) !== -1) {
      // If the item added was 'All Items' then no other items should/can be applied to this alert
      if (alertForItem === 'All Items') {
        this.appliesToItemSelections = [alertForItem];
        this.possibleItemSelections = [];
      } else {
        // Otherwise, just add it to the list of selections, and remove it from the list of possible selections
        this.appliesToItemSelections.push(alertForItem);
        const index = this.possibleItemSelections.indexOf(alertForItem);
        this.possibleItemSelections.splice(index, 1);
      }
      // Reset the input value to blank so the user does not have to manually clear it out
      alertForItemsFormControl.setValue('');
    }

  }

  /**
   * Determines if the user has selected valid items
   */
  checkIfItemSelectionsAreValid() {
    const alertForItemsFormControl = this.alertForm.controls.altertForItem as FormControl;
    const alertForItem: string = alertForItemsFormControl.value;

    // If the item inputted doesn't match one of the possible selections, and there are no
    // selections made yet, then show an error.
    if (this.possibleItemSelections.indexOf(alertForItem) === -1 && this.appliesToItemSelections.length === 0) {
      this.alertForm.controls.altertForItem.setErrors({
        notValidItem: true
      });
    }
  }

  /**
   *
   */
  removeItemSelection(itemSelection: string): void {
    const index = this.appliesToItemSelections.indexOf(itemSelection);
    this.appliesToItemSelections.splice(index, 1);

    if(itemSelection === 'All Items') {
      this.possibleItemSelections = this.initializeItemSelections(this.inventoryItems);
    } else {
      this.possibleItemSelections.push(itemSelection);
    }
  }

  /**
   * Adds the alert to the alert list (add alert layer).
   */
  addAlert(): void {
    // Get the values that were entered in the form
    const alertFormControl = this.alertForm.controls;
    const alertTitleValue: string = alertFormControl.alertTitle.value;
    const alertAtQuantityValue: number = alertFormControl.alertAtQuantity.value;

    // Create a new alert from those values
    const newAlertToAdd: Alert = {
      title: alertTitleValue,
      id: Math.round(Math.random() * 10), // For now, just create a random id
      appliesToItems: this.appliesToItemSelections,
      reminderQuantity: alertAtQuantityValue
    }

    // Add the new alert to the alert list
    this.alerts.push(newAlertToAdd);
    this.alertService.saveAlertChanges(this.alerts);

    // Close the layer.
    this.closeModal();
  }

  /**
   * Saves any changes made on the edit alert layers
   */
  saveAlertChanges(): void {
    // Get the values that were entered in the form
    const alertFormControl = this.alertForm.controls;
    const alertTitleValue: string = alertFormControl.alertTitle.value;
    const alertAtQuantityValue: number = alertFormControl.alertAtQuantity.value;

    const alertToUpdate = this.alerts[this.modalAlertIndex];
    alertToUpdate.title = alertTitleValue;
    alertToUpdate.appliesToItems = this.appliesToItemSelections;
    alertToUpdate.reminderQuantity = alertAtQuantityValue;

    // Add the new alert to the alert list
    this.alerts[this.modalAlertIndex] = alertToUpdate;
    this.alertService.saveAlertChanges(this.alerts);

    // Close the layer.
    this.closeModal();
  }
}
