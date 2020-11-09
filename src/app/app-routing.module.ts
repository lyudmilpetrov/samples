import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartJSComponent } from './chart-js/chart-js.component';


export const routes: Routes = [
  { path: '', redirectTo: 'chart-js', pathMatch: 'full' },
  { path: 'chart-js', component: ChartJSComponent },
  { path: 'signalr-chat-app', loadChildren: () => import('./signalr-chat/signalr-chat.module').then(m => m.SignalRChatModule) },
  { path: 'face-recognition', loadChildren: () => import('./face-recognition/face-recognition.module').then(m => m.FaceRecognitionModule) },
  { path: '**', redirectTo: 'chart-js', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
