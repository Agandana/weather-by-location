import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenWeatherMapComponent } from './open-weather-map.component';

const routes: Routes = [
  { path: '', component: OpenWeatherMapComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenWeatherMapRoutingModule { }
