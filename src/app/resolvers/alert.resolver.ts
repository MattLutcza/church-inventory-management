import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { AlertService } from '../services/alert.service';
import { Alert } from '../models/alert';

@Injectable()
export class AlertResolver implements Resolve<Alert[]> {

    constructor(private alertService: AlertService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Alert[] {
        return this.alertService.getAlerts();
    }
}
