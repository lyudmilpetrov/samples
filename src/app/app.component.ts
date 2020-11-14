import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { TasksService } from '@app/signalr-core/tasks.service';
import { Subscription } from 'rxjs';
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
  constructor(router: Router) {
    this.routerSubscription = router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor();
    });
  }
  navigationInterceptor(): void {
    this.counter += 1;
    if (this.counter >= 1) {
      // this.ts.initilizeSignalR(signalrpoint, 'tasks');
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
