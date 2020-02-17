import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemProfitBreakdownComponent } from './item-profit-breakdown.component';

describe('ItemProfitBreakdownComponent', () => {
  let component: ItemProfitBreakdownComponent;
  let fixture: ComponentFixture<ItemProfitBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemProfitBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemProfitBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
