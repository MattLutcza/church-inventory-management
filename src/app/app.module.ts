import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './components/pages/home/home.component';
import { AlertsComponent } from './components/partials/alerts/alerts.component';
import { InventoryComponent } from './components/partials/inventory/inventory.component';
import { NavigationBarComponent } from './components/partials/navigation-bar/navigation-bar.component';
import { LatestSoldComponent } from './components/partials/latest-sold/latest-sold.component';
import { LatestBoughtComponent } from './components/partials/latest-bought/latest-bought.component';

import { ViewInventoryComponent } from './components/pages/view-inventory/view-inventory.component';
import { AddItemComponent } from './components/pages/add-item/add-item.component';
import { ManageAlertsComponent } from './components/pages/manage-alerts/manage-alerts.component';
import { SellItemComponent } from './components/pages/sell-item/sell-item.component';
import { YearlyCountStatisticsComponent } from './components/pages/yearly-count-statistics/yearly-count-statistics.component';
import { YearlyProfitStatisticsComponent } from './components/pages/yearly-profit-statistics/yearly-profit-statistics.component';
import { YearlyCashflowStatisticsComponent } from './components/pages/yearly-cashflow-statistics/yearly-cashflow-statistics.component';

import { AlertService } from './services/alert.service';
import { InventoryService } from './services/inventory.service';
import { YearlyChartService } from './services/yearly-chart.service';

import { AlertResolver } from './resolvers/alert.resolver';
import { InventoryResolver } from './resolvers/inventory.resolver';
import { ItemCountBreakdownComponent } from './components/pages/item-count-breakdown/item-count-breakdown.component';
import { ItemProfitBreakdownComponent } from './components/pages/item-profit-breakdown/item-profit-breakdown.component';
import { ItemCashflowBreakdownComponent } from './components/pages/item-cashflow-breakdown/item-cashflow-breakdown.component';
import { ItemsInStockComponent } from './components/pages/items-in-stock/items-in-stock.component';
import { NoItemsComponent } from './components/partials/no-items/no-items.component';
import { NoItemsInStockComponent } from './components/partials/no-items-in-stock/no-items-in-stock.component';
import { NoItemsSoldComponent } from './components/partials/no-items-sold/no-items-sold.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AlertsComponent,
    InventoryComponent,
    NavigationBarComponent,
    LatestSoldComponent,
    LatestBoughtComponent,
    ViewInventoryComponent,
    AddItemComponent,
    ManageAlertsComponent,
    SellItemComponent,
    YearlyCountStatisticsComponent,
    YearlyProfitStatisticsComponent,
    YearlyCashflowStatisticsComponent,
    ItemCountBreakdownComponent,
    ItemProfitBreakdownComponent,
    ItemCashflowBreakdownComponent,
    ItemsInStockComponent,
    NoItemsComponent,
    NoItemsInStockComponent,
    NoItemsSoldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    NgxChartsModule
  ],
  providers: [
    InventoryService,
    InventoryResolver,
    AlertService,
    AlertResolver,
    YearlyChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
