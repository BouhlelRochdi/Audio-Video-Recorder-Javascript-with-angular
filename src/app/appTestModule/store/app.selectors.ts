import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromApp from './app.reducer';

export const selectAppState = createFeatureSelector<fromApp.AppState>(
  fromApp.AppFeatureKey
);

export const selectWorkerFrameworks = createSelector(
  selectAppState,
  (state: fromApp.AppState) => state.AppList
);