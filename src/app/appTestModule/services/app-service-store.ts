import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';


@Injectable({ providedIn: 'root' })
export class AppStoreService {


  constructor(
    private appServiceStore: Store<fromApp.AppState>) { }

}