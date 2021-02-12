import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartJSComponent } from './chart-js/chart-js.component';


export const routes: Routes = [
  { path: '', redirectTo: 'chart-js', pathMatch: 'full' },
  { path: 'chart-js', component: ChartJSComponent },
  { path: 'face-login', loadChildren: () => import('./face-login/face-login.module').then(m => m.FaceLoginModule) },
  { path: 'signalr-chat-app', loadChildren: () => import('./signalr-chat/signalr-chat.module').then(m => m.SignalRChatModule) },
  { path: 'face-recognition', loadChildren: () => import('./face-recognition/face-recognition.module').then(m => m.FaceRecognitionModule) },
  { path: 'web-gl', loadChildren: () => import('./web-gl/web-gl.module').then(m => m.WebGLModule) },
  { path: 'face-mesh', loadChildren: () => import('./face-mesh/face-mesh.module').then(m => m.FaceMeshModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
  { path: 'landing-video', loadChildren: () => import('./landing-video/landing-video.module').then(m => m.LandingVideoModule) },
  { path: 'webrtc', loadChildren: () => import('./web-rtc/web-rtc.module').then(m => m.WebRTCModule) },
  { path: 'stocks', loadChildren: () => import('./stocks/stocks-sample.model').then(m => m.StocksSampleModule) },
  { path: '**', redirectTo: 'chart-js', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
