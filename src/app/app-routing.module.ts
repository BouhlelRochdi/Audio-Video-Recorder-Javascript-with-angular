import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '', pathMatch: 'full', redirectTo: 'recorder'
  },
  {
    path: 'recorder',
    loadComponent: () => import('../../projects/recorder/src/lib/recorder/recorder.component').then(m => m.RecorderComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
