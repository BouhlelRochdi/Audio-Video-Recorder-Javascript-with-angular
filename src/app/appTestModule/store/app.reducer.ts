import { createReducer, on } from '@ngrx/store';

export const AppFeatureKey = 'worker';

export interface AppState {
  AppList: any
}

export const initialState: AppState = {
  AppList : null
};


export const reducer = createReducer(
  initialState,
  
);

