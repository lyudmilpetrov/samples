import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { TasksService } from '@app/signalr-core/tasks.service';
import { Subscription } from 'rxjs';
import * as faceapi from 'face-api.js';
import { GlobalStaticVariables } from './shared/globals';
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
  signalrpoint = 'https://localhost:44382/';
  constructor(
    private router: Router,
    private ts: TasksService,
    private gsv: GlobalStaticVariables
  ) {
    switch (window.location.origin) {
      case 'http://localhost:4200':
        this.gsv.set('api', 'signalrapi', 'https://localhost:44382/');
        break;
      default:
        this.gsv.set('api', 'signalrapi', window.location.origin);
        break;
    }
    this.routerSubscription = router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor();
    });
  }
  navigationInterceptor(): void {
    this.counter += 1;
    if (this.counter >= 1) {
      console.log(this.signalrpoint);
      this.ts.initilizeSignalR(this.signalrpoint, 'tasks');
    }
  }
  ngOnInit() {
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
