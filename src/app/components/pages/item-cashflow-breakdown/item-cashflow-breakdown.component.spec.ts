import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCashflowBreakdownComponent } from './item-cashflow-breakdown.component';

describe('ItemCashflowBreakdownComponent', () => {
  let component: ItemCashflowBreakdownComponent;
  let fixture: ComponentFixture<ItemCashflowBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCashflowBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCashflowBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
