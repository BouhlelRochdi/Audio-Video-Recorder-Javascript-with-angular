import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './store/app.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(fromApp.AppFeatureKey,
      fromApp.reducer),
    EffectsModule.forFeature([AppEffects])
  ],
})
export class AppFrontStoreModule { }
