import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  menuItems = ['Chart.js', 'SignalR'];
  LabelStr = this.menuItems[0];
  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router) { }
  selected(s: string) {
    this.LabelStr = s;
    const x = s.toLocaleLowerCase().replace(' ', '').replace('.', '-');
    // console.log(x);
    this.router.navigate([x]);
  }
  ngOnInit() {
    // // console.log('called');
  }
}
