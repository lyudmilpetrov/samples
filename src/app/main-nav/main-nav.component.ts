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
  @ViewChild('drawer', { static: true }) drawer: MatSidenav;
  @ViewChild('top', { static: true }) top: MatToolbar;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  menuItems = ['Chart.js'];
  LabelStr = '';
  hidetop = false;
  hidetop2 = false;
  sentToSignalRChannel = '';
  items: ChannelEvent[] = [];
  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef) {
    console.log(window.location.hostname);
    router.events.pipe(
      withLatestFrom(this.isHandset$),
      filter(([a, b]) => b && a instanceof NavigationEnd)
    ).subscribe(_ => this.drawer.close());
    if (window.location.hostname === 'localhost') {
      this.menuItems = ['Chart.js', 'Face-Login', 'Face-Recognition', 'Face-Mesh', 'Maps', 'Landing-video'];
    } else {
      this.menuItems = ['Chart.js', 'Face-Recognition', 'Landing-video'];
    }
    this.LabelStr = this.menuItems[0];
  }
  selected(s: string) {
    this.LabelStr = s;
    const x = s.toLocaleLowerCase().replace(' ', '').replace('.', '-');
    this.router.navigate([x]);
    this.hidetop = false;
    this.hidetop2 = false;
  }
  ngOnInit() {
    // // // // console.log('called');
  }
  expand() {
    this.drawer.close();
    if (this.LabelStr === 'Landing-video') {
      this.hidetop = false;
      this.hidetop2 = true;
    } else {
      this.hidetop = true;
      this.hidetop2 = false;
    }
  }
  shrink() {
    this.drawer.open();
    this.hidetop = false;
    this.hidetop2 = false;
  }
  receiveFromSignalR($event: ChannelEvent) {
    // // // // // // // console.log($event);
    if (typeof $event.Data.State !== 'undefined') {
      this.items.push($event);
      this.message = $event;
      this.cdr.detectChanges();
      if ($event.Data.State.includes('Download')) {
        // // // // // // // console.log('download here');
      }
    }
  }
  ngAfterViewInit() {
    this.sentToSignalRChannel = 'signalrdemo';
  }
}
