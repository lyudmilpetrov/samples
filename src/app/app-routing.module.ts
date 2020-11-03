import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartJSComponent } from './chart-js/chart-js.component';


export const routes: Routes = [
  { path: '', redirectTo: 'samples/chart-js', pathMatch: 'full' },
  { path: 'samples/chart-js', component: ChartJSComponent },
  // { path: 'samples/chart-js', loadChildren: () => import('./chart-js/chart-js.module').then(m => m.ChartJSModule) },
  { path: '**', redirectTo: 'samples/chart-js', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
