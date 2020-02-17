import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/pages/home/home.component';
import { ViewInventoryComponent } from './components/pages/view-inventory/view-inventory.component';
import { AddItemComponent } from './components/pages/add-item/add-item.component';
import { SellItemComponent } from './components/pages/sell-item/sell-item.component';
import { ManageAlertsComponent } from './components/pages/manage-alerts/manage-alerts.component';
import { YearlyCountStatisticsComponent } from './components/pages/yearly-count-statistics/yearly-count-statistics.component';
import { YearlyProfitStatisticsComponent } from './components/pages/yearly-profit-statistics/yearly-profit-statistics.component';
import { YearlyCashflowStatisticsComponent } from './components/pages/yearly-cashflow-statistics/yearly-cashflow-statistics.component';
import { ItemCountBreakdownComponent } from './components/pages/item-count-breakdown/item-count-breakdown.component';

import { AlertResolver } from './resolvers/alert.resolver';
import { InventoryResolver } from './resolvers/inventory.resolver';
import { ItemCashflowBreakdownComponent } from './components/pages/item-cashflow-breakdown/item-cashflow-breakdown.component';
import { ItemProfitBreakdownComponent } from './components/pages/item-profit-breakdown/item-profit-breakdown.component';
import { ItemsInStockComponent } from './components/pages/items-in-stock/items-in-stock.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    resolve: {
      inventoryAlerts: AlertResolver,
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'view-inventory',
    component: ViewInventoryComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'items-in-stock',
    component: ItemsInStockComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'add-item',
    component: AddItemComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'sell-item',
    component: SellItemComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'manage-alerts',
    component: ManageAlertsComponent,
    resolve: {
      inventoryAlerts: AlertResolver,
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'statistics/yearly-item-sold-count',
    component: YearlyCountStatisticsComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'statistics/yearly-item-sold-profit',
    component: YearlyProfitStatisticsComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'statistics/yearly-item-sold-cashflow',
    component: YearlyCashflowStatisticsComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'statistics/item-sold-count-breakdown',
    component: ItemCountBreakdownComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'statistics/item-sold-profit-breakdown',
    component: ItemProfitBreakdownComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: 'statistics/item-sold-cashflow-breakdown',
    component: ItemCashflowBreakdownComponent,
    resolve: {
      inventoryItems: InventoryResolver
    }
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
