import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '', pathMatch: 'full', redirectTo: 'recorder-rtc'
  },
  {
    path: 'recorder',
    loadComponent: () => import('../../projects/recorder/src/lib/recorder/recorder.component').then(m => m.RecorderComponent)
  },
  {
    path: 'recorder-rtc',
    loadComponent: () => import('../../projects/recorder/src/lib/recorder-rtc/recorder-rtc.component').then(m => m.RecorderRtcComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
