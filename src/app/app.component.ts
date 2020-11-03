import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { TasksService } from '@app/signalr/tasks.service';
import { Subscription } from 'rxjs';
import { ChannelEvent } from './signalr/signalr.models';
import * as faceapi from 'face-api.js';
export let broweserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  counter = 0;
  title = 'speech-recognition';
  refreshSubscription: Subscription;
  routerSubscription: Subscription;
  constructor(private ts: TasksService, private router: Router) {
    this.routerSubscription = router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }
  navigationInterceptor(event: RouterEvent): void {
    const signalrpoint = 'https://localhost:60127/';
    this.counter += 1;
    if (this.counter >= 1) {
      this.ts.initilizeSignalR(signalrpoint, 'tasks');
    }
  }
  ngOnInit() {
    const MODEL_URL = '../assets/weights';
    // console.log('!!!!!!!!!!!!!!');
    // console.log(faceapi);
    async function loadF(url: string, call: string) {
      await faceapi[call](url);
      // await faceapi.loadFaceLandmarkModel(url);
      // await faceapi.loadFaceRecognitionModel(url);
      // the internal part of our async function
      // will still be executed synchronously thanks
      // to the await keyword
      // setTimeout(() => {
      //   // console.log('Function: %d executed', input);
      // }, 1000 * input);
    }
    // Promise.all([myAsyncFunction(3), myAsyncFunction(2), myAsyncFunction(1)]);
    // https://school.geekwall.in/p/Hy29kFEGm/face-recognition-in-the-browser-with-tensorflow-js-javascript
    Promise.all([loadF(MODEL_URL, 'loadFaceDetectionModel'), loadF(MODEL_URL, 'loadFaceLandmarkModel'), loadF(MODEL_URL, 'loadFaceRecognitionModel')]);

  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
