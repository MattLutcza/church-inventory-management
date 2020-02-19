import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { InventoryItem } from 'src/app/models/inventory-item';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-sell-item',
  templateUrl: './sell-item.component.html',
  styleUrls: ['./sell-item.component.scss']
})
export class SellItemComponent implements OnInit {

  modalRef: BsModalRef;

  itemSelections: string[][];
  /*
    [0] = ['12','43'],
    [1] = ['12','43'],
    etc
  */

  possibleSellMethods: string[];
  displayedInventoryItems: InventoryItem[];
  unsoldInventoryItems: InventoryItem[];

  markItemSoldForm: FormGroup;
  displaySellPriceInfoMessageArray: boolean[];

  private inventoryItems: InventoryItem[];

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder,
      private modalService: BsModalService, private inventoryService: InventoryService) {
    this.initializePage();
  }

  private initializePage(): void {
    // Construct today's date with zero hours
    const today = new Date();
    today.setHours(0);

    // Initialize our form group that will represent ONE item input section
    // No default itemID value
    // Default the sell date to today
    // Default the sell method to 'Cash'
    const formGroup = this.formBuilder.group({
      itemID: new FormControl('', Validators.required),
      sellDate: new FormControl(today, Validators.required),
      sellPrice: new FormControl(0, Validators.required),
      sellMethod: new FormControl('Cash', Validators.required)
    });

    // Create a form group array using the above form group
    // (start with only one form group in the array)
    this.markItemSoldForm = this.formBuilder.group({
      itemForm: this.formBuilder.array([formGroup])
    });

    //const test = this.markItemSoldForm.controls.itemForm as FormArray;
    //test.push(formGroup);

    // Initialize other properties
    this.displayedInventoryItems = [];
    this.itemSelections = [];
    this.displaySellPriceInfoMessageArray = [];

    this.possibleSellMethods = this.getPossibleSellMethods();
  }

  /**
   * Helper function to retrieve the list of controls of the form array
   */
  get itemFormArrayControls(): AbstractControl[] {
    const itemFormArray = this.markItemSoldForm.controls.itemForm as FormArray;
    return itemFormArray.controls;
  }
  /**
   * Helper function to retrieve the form array itself
   */
  get itemFormArray(): FormArray {
    return this.markItemSoldForm.controls.itemForm as FormArray;
  }

  /**
   * Initialize component data:
   * - From all the inventory items, determine which ones haven't been sold yet.
   * - From the list of items that are not sold yet, get the list of their IDs, and
   *   make those IDs the possible selections to the first index (form).
   *
   */
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.inventoryItems = data.inventoryItems;
      this.initializeInventory();
    });
  }

  private initializeInventory(): void {
    this.unsoldInventoryItems = this.getUnsoldInventoryItems(this.inventoryItems);
    this.itemSelections.push(this.getItemIDs(this.unsoldInventoryItems));
  }

  /**
   *
   * @param inventoryItems
   */
  private getUnsoldInventoryItems(inventoryItems: InventoryItem[]): InventoryItem[] {
    return inventoryItems.filter((inventoryItem: InventoryItem) => {
      if (!inventoryItem.sellDate) {
        return inventoryItem;
      }
    });
  }

  /**
   * Maps a list of inventory items to a list of IDs (as strings)
   * @param inventoryItems
   */
  private getItemIDs(inventoryItems: InventoryItem[]): string[] {
    return inventoryItems.map(inventoryItem => {
      return inventoryItem.id.toString();
    });
  }

  /**
   * Initializes the possible sell methods.
   */
  private getPossibleSellMethods(): string[] {
    return ['Cash', 'Check', 'Credit'];
  }

  /**
   * Handles the action of marking multiple items
   * - Creates a new form group for the other item
   * - Determines the possible ID selections for the new form group
   */
  addAnotherItemToSellForm(): void {
    // Construct today's date with zero hours
    const today = new Date();
    today.setHours(0);

    // No default itemID value
    // Default the sell date to today
    // Default the sell method to 'Cash'
    const defaultFormGroup = this.formBuilder.group({
      itemID: new FormControl('', Validators.required),
      sellDate: new FormControl(today, Validators.required),
      sellPrice: new FormControl(0, Validators.required),
      sellMethod: new FormControl('Cash', Validators.required)
    });
    const existingFormArray = this.markItemSoldForm.controls.itemForm as FormArray;
    existingFormArray.push(defaultFormGroup);

    // Initialize the ID selections for this new form group to all unsold items
    this.itemSelections.push(this.getItemIDs(this.unsoldInventoryItems));

    // Remove already inputted ids from future possible ID selections.
    this.determinePossibleIDs();

    this.displaySellPriceInfoMessageArray.push(false);
  }

  /**
   * Removes the form input fields related to the removed item.
   * @param formIndex
   */
  removeInputFields(formIndex: number): void {
    this.itemFormArray.removeAt(formIndex);
    this.displayedInventoryItems.splice(formIndex, 1);
    this.displaySellPriceInfoMessageArray.splice(formIndex, 1);
    this.determinePossibleIDs();
  }

  /**
   * When an ID is inputted or selected, validate inputs and, if valid, retrieve the item details
   * for that ID
   * @param formArrayIndex
   */
  handleItemInputChange(formArrayIndex: number) {

    const itemFormGroup = this.itemFormArray.at(formArrayIndex) as FormGroup;
    const idFormControl = itemFormGroup.controls.itemID as FormControl;

    const idValue: number = parseInt(idFormControl.value);

    const isNumber = !isNaN(idValue);
    const isPossibleSelection = this.itemSelections[formArrayIndex].includes(idFormControl.value);

    if (isNumber && isPossibleSelection) {
      this.displayItem(itemFormGroup, idFormControl, formArrayIndex, idValue);
    }
  }

  /**
   *
   * @param formArrayIndex
   */
  validateID(formArrayIndex: number): void {
    const itemFormGroup = this.itemFormArray.at(formArrayIndex) as FormGroup;
    const idFormControl = itemFormGroup.controls.itemID as FormControl;

    const idValue: number = parseInt(idFormControl.value);

    if (isNaN(idValue)) {
      idFormControl.setErrors({
         notNumber: true
      });
    } else {
      const isPossibleSelection = this.itemSelections[formArrayIndex].includes(idFormControl.value);
      if (!isPossibleSelection) {
        idFormControl.setErrors({
          alreadyInputted: true
       });
      }
    }
  }

  /**
   *
   * @param formArrayIndex
   * @param itemID
   * @param idFormControl
   */
  private displayItem(itemFormGroup: FormGroup, idFormControl: FormControl, formArrayIndex: number, itemID: number) {

    // Verify it is a valid unsold item
    const specificInventoryItem = this.unsoldInventoryItems.filter(item => {
      return item.id === itemID;
    })[0];

    if (specificInventoryItem === undefined ) {
      idFormControl.setErrors({
        badID: true
      });
    } else {
      this.displayedInventoryItems[formArrayIndex] = specificInventoryItem;
      itemFormGroup.controls.sellPrice.setValue(specificInventoryItem.sellPrice);
      this.displaySellPriceInfoMessageArray[formArrayIndex] = false;
      this.determinePossibleIDs();
    }
  }

  /**
   * Iterate through all forms to determine the IDs that are already inputted.
   * Remove them from possible future input selections since they are already valued.
   */
  private determinePossibleIDs() {

    // Go through all forms
    for (let counter = 0; counter < this.itemFormArray.length; counter = counter + 1) {
      let otherInputtedIDs = [];

      // For each form, go through all other forms
      for (let otherCounter = 0; otherCounter < this.itemFormArray.length; otherCounter = otherCounter + 1) {
        // Determine ID input values that are valued in the other forms
        if (counter !== otherCounter) {
          const formGroup = this.itemFormArray.at(otherCounter) as FormGroup;
          otherInputtedIDs.push(formGroup.value.itemID);
        }
      }

      // For every ID that is already inputted in the other forms, remove them as a possible
      // selection for this form input
      this.itemSelections[counter] = this.getItemIDs(this.unsoldInventoryItems).filter(id => {
        return !otherInputtedIDs.includes(id);
      });
    }
  }

  /**
   *
   * @param formArrayIndex
   */
  checkSellPrice(formArrayIndex: number) {
    const itemFormGroup = this.itemFormArray.at(formArrayIndex) as FormGroup;

    const idValueString = itemFormGroup.controls.itemID.value;
    const idValue = Number(idValueString);
    const isNumber = !isNaN(idValue);
    const isPossibleSelection = this.itemSelections[formArrayIndex].includes(idValueString);

    if (isNumber && isPossibleSelection) {
      // Find the item
      const specificInventoryItem = this.unsoldInventoryItems.filter(item => {
        return item.id === idValue;
      })[0];

      if (specificInventoryItem !== undefined ) {
        this.displaySellPriceInfoMessageArray[formArrayIndex] =  specificInventoryItem.sellPrice !== Number(itemFormGroup.controls.sellPrice.value);
      }
    }
  }

  /**
   *
   */
  markItemsAsSold(template: TemplateRef<any>): void {

    for(let counter = 0; counter < this.itemFormArray.length; counter = counter + 1) {
      const itemFormGroup = this.itemFormArray.at(counter) as FormGroup;
      const itemID = parseInt(itemFormGroup.controls.itemID.value);
      const sellDate = new Date(itemFormGroup.controls.sellDate.value);
      const sellPrice = Number(itemFormGroup.controls.sellPrice.value);
      const sellMethod = itemFormGroup.controls.sellMethod.value;
      this.inventoryService.markInventoryItemsSold(itemID, sellDate, sellMethod, sellPrice)
    }

    this.modalRef = this.modalService.show(template);
  }

  /**
   *
   */
  openConfirmResetFormLayer(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  resetForm(): void {
    this.initializePage();
    this.initializeInventory();
    this.closeModal();
  }

  /**
   * Closes the current layer that is open
   */
  closeModal() {
    this.modalRef.hide();
  }

}
