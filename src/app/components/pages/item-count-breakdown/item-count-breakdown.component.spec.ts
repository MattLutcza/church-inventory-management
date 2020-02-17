import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCountBreakdownComponent } from './item-count-breakdown.component';

describe('ItemCountBreakdownComponent', () => {
  let component: ItemCountBreakdownComponent;
  let fixture: ComponentFixture<ItemCountBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCountBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCountBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
