import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { InventoryItem } from 'src/app/models/inventory-item';
import { InventoryService } from 'src/app/services/inventory.service';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {

  modalRef: BsModalRef;

  orderForm: FormGroup;

  previouslyEnteredSuppliers: Set<string>;
  previouslyEnteredItems: Set<string>;
  previouslyEnteredCategories: Set<string>;
  previouslyEnteredSubcategories: Set<string>;

  perItemShippingTaxCost: string;

  private inventoryItems: InventoryItem[];

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder,
    private modalService: BsModalService, private inventoryService: InventoryService) {
      this.initializeForm();
  }

  private initializeForm(): void {
    const orderDetailsFormGroup = this.formBuilder.group({
      itemName: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      subcategory: new FormControl('', Validators.required),
      itemCost: new FormControl('', Validators.required),
      itemQuantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      sellPrice: new FormControl('', Validators.required)
    });

    // Construct today's date with zero hours
    const today = new Date();
    today.setHours(0);

    // Create a form group that contains a few form values and a form array that
    //uses the above form group (start with only one form group in the form array)
    this.orderForm = this.formBuilder.group({
      supplier: new FormControl('', Validators.required),
      donated: new FormControl('Yes', Validators.required),
      shippingTaxCost: new FormControl('', Validators.required),
      purchaseDate: new FormControl(today, Validators.required),
      orderDetailFormArray: this.formBuilder.array([orderDetailsFormGroup])
    });
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.inventoryItems = data.inventoryItems;
      this.initializePreviousValues();
    });
  }

  /**
   *
   */
  private initializePreviousValues(): void {
    this.previouslyEnteredSuppliers = this.getItemPropertyValues(this.inventoryItems, 'supplier');
    this.previouslyEnteredItems = this.getItemPropertyValues(this.inventoryItems, 'name');
    this.previouslyEnteredCategories = this.getItemPropertyValues(this.inventoryItems, 'category');
    this.previouslyEnteredSubcategories = this.getItemPropertyValues(this.inventoryItems, 'subcategory');
  }

  /**
   *
   */
  private getItemPropertyValues(inventoryItems: InventoryItem[], property: string): Set<string> {
    const propertyValues = inventoryItems.map(item => {
      return item[property];
    });

    return new Set(propertyValues);
  }

  /**
   * Helper function to retrieve the form array
   */
  get orderDetailFormArrayControls() {
    const orderDetailFormArray = this.orderForm.controls.orderDetailFormArray as FormArray;
    return orderDetailFormArray.controls;
  }

    /**
   * Helper function to retrieve the form array
   */
  get orderDetailFormArray() {
    return this.orderForm.controls.orderDetailFormArray as FormArray;
  }

  /**
   *
   */
  prepopulateOtherItemInputs(formIndex: number): void {
    const itemFormGroup = this.orderDetailFormArray.at(formIndex) as FormGroup;
    const itemToUse = this.inventoryItems.filter(item => {
      if(item.name === itemFormGroup.controls.itemName.value) {
        return item;
      }
    })[0];

    itemFormGroup.controls.category.setValue(itemToUse.category);
    itemFormGroup.controls.subcategory.setValue(itemToUse.subcategory);
    itemFormGroup.controls.sellPrice.setValue(itemToUse.sellPrice);
    itemFormGroup.controls.itemCost.setValue(itemToUse.purchasePrice);
  }

  calculatePerItemShippingTaxCost(): void {
    let shippingTaxCost = 0;
    if(this.orderForm.controls.shippingTaxCost.valid) {
      shippingTaxCost = this.orderForm.controls.shippingTaxCost.value;
    }

    let totalNumberOfItems = 0
    for(let counter = 0; counter < this.orderDetailFormArray.length; counter = counter + 1) {
      const itemDetailForm = this.orderDetailFormArray.at(counter) as FormGroup;
      if (itemDetailForm.controls.itemQuantity.valid) {
        totalNumberOfItems = totalNumberOfItems + itemDetailForm.controls.itemQuantity.value;
      }
    }

    if(shippingTaxCost !== 0 && totalNumberOfItems !== 0) {
      const perItemShippingTaxCost = shippingTaxCost / totalNumberOfItems;
      this.perItemShippingTaxCost = formatCurrency(perItemShippingTaxCost, 'en-US', '$', undefined, '1.2');
    }
  }

  addAnotherOrderDetail(): void {
    const itemDetailFormGroup = this.formBuilder.group({
      itemName: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      subcategory: new FormControl('', Validators.required),
      itemCost: new FormControl('', Validators.required),
      itemQuantity: new FormControl(1, [Validators.required, Validators.min(1)]),
      sellPrice: new FormControl('', Validators.required)
    });

    this.orderDetailFormArray.push(itemDetailFormGroup);
  }

    /**
   * Removes the form input fields related to the removed item.
   * @param formIndex
   */
  removeItemInputFields(formIndex: number): void {
    this.orderDetailFormArray.removeAt(formIndex);
  }

  submitOrder(template: TemplateRef<any>): void {
    const newItems: InventoryItem[] = [];

    const supplier = this.orderForm.controls.supplier.value;
    const donated = this.orderForm.controls.donated.value;
    const shippingTaxCost = this.orderForm.controls.shippingTaxCost.value;
    const purchaseDate = this.orderForm.controls.purchaseDate.value;

    let lastUsedID = this.getHighestItemID();
    let newID = lastUsedID + 1;
    let totalNumberOfItems = 0;

    for(let counter = 0; counter < this.orderDetailFormArray.length; counter = counter + 1) {
      const itemFormGroup = this.orderDetailFormArray.at(counter) as FormGroup;
      const numberOfItems = itemFormGroup.controls.itemQuantity.value;
      totalNumberOfItems = totalNumberOfItems + numberOfItems;
      const itemName = itemFormGroup.controls.itemName.value;
      const itemCategory = itemFormGroup.controls.category.value;
      const itemSubcategory = itemFormGroup.controls.subcategory.value;
      const itemSellPrice = itemFormGroup.controls.sellPrice.value;
      const itemCost = itemFormGroup.controls.itemCost.value;

      for(let itemCounter = 0; itemCounter < numberOfItems; itemCounter = itemCounter + 1) {        
        const newItem = {
          id: newID,
          name: itemName,
          category: itemCategory,
          subcategory: itemSubcategory,
          supplier: supplier,
          donated: donated,
          purchasePrice: itemCost,
          taxAndShippingPrice: shippingTaxCost,
          sellPrice: itemSellPrice,
          purchaseDate: purchaseDate
        };        
        newItems.push(newItem);
        newID += 1;
      }
    }

    // Now that we know how many items are being added, we can correctly divide the total
    // shipping / tax cost among all the items.
    const dividedTaxAndShippingCost = shippingTaxCost / totalNumberOfItems;
    newItems.forEach(item => {
      item.taxAndShippingPrice = dividedTaxAndShippingCost;
    });

    this.inventoryService.addNewInventoryItems(newItems);

    this.modalRef = this.modalService.show(template);
  }

  /**
   *
   */
  openConfirmResetFormLayer(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  /**
   *
   */
  resetForm(): void {
    this.initializeForm();
    this.initializePreviousValues();
    this.closeModal();
  }

  /**
   * Closes the current layer that is open
   */
  closeModal() {
    this.modalRef.hide();
  }

  private getHighestItemID(): number {
    let maxID = 0;

    this.inventoryItems.forEach(item => {
      maxID = item.id > maxID ? item.id : maxID;
    });

    return maxID;
  }

}
