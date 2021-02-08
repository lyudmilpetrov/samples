import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTabNav } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import { ChannelEvent } from '@app/signalr-core/signalr.models';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit, AfterViewInit {
  @Input() message: ChannelEvent = {
    Name: '',
    ChannelName: '',
    Timestamp: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, -1),
    Data: {
      State: 'Process info below',
      PercentComplete: 0,
      json: ''
    },
    Json: ''
  };
  menuItems = ['Chart.js'];
  LabelStr = '';
  hidetop = false;
  hidetop2 = false;
  hidenav = false;
  sentToSignalRChannel = '';
  items: ChannelEvent[] = [];
  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef) {
    if (window.location.hostname === 'localhost') {
      this.menuItems = ['Chart.js', 'Face-Login', 'Face-Recognition', 'Face-Mesh', 'Maps', 'Landing-video', 'WebRTC'];
    } else {
      this.menuItems = ['Chart.js', 'Face-Recognition', 'Landing-video'];
    }
    this.LabelStr = this.menuItems[0];
  }
  selected(s: string) {
    this.hidenav = true;
    this.LabelStr = s;
    const x = s.toLocaleLowerCase().replace(' ', '').replace('.', '-');
    console.log(x);
    this.router.navigate([x]);
    this.hidetop = false;
    this.hidetop2 = false;
  }
  ngOnInit() {}
  receiveFromSignalR($event: ChannelEvent) {
    // // // // // // // // console.log($event);
    if (typeof $event.Data.State !== 'undefined') {
      this.items.push($event);
      this.message = $event;
      this.cdr.detectChanges();
      if ($event.Data.State.includes('Download')) {
        // // // // // // // // console.log('download here');
      }
    }
  }
  ngAfterViewInit() {
      this.sentToSignalRChannel = 'signalrdemo';
  }
}
