import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppAppHttpService } from '../services/app-http.service';
import * as fromApp from '../store/app.reducer';
import { Actions } from '@ngrx/effects';


@Injectable()
export class AppEffects {

  constructor(
    private actions$: Actions,
    private AppAppHttpService: AppAppHttpService,
    private AppStore: Store<fromApp.AppState>
  ) { }

}
