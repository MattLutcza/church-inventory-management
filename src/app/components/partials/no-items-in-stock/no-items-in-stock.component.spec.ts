import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoItemsInStockComponent } from './no-items-in-stock.component';

describe('NoItemsInStockComponent', () => {
  let component: NoItemsInStockComponent;
  let fixture: ComponentFixture<NoItemsInStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoItemsInStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoItemsInStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
