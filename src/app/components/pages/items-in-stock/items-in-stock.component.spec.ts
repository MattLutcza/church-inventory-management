import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsInStockComponent } from './items-in-stock.component';

describe('ItemsInStockComponent', () => {
  let component: ItemsInStockComponent;
  let fixture: ComponentFixture<ItemsInStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsInStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsInStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
