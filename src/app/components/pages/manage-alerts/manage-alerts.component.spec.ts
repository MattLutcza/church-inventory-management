import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAlertsComponent } from './manage-alerts.component';

describe('ManageAlertsComponent', () => {
  let component: ManageAlertsComponent;
  let fixture: ComponentFixture<ManageAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
