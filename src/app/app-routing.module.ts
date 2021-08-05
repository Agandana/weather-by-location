import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/open-weather-map' },
  { path: 'open-weather-map', loadChildren: () => import('./pages/open-weather-map/open-weather-map.module').then(m => m.OpenWeatherMapModule) },
  { path: 'form', loadChildren: () => import('./pages/form/form.module').then(m => m.FormModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
