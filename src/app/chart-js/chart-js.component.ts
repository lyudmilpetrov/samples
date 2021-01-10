import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ɵConsole, ChangeDetectorRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Directive, ElementRef } from '@angular/core';
import { ApiServices, DataServices, GenericServices, OfflineService } from '../services/services';
import { Subject, interval, Subscription, BehaviorSubject } from 'rxjs';
import { filter, map, pairwise } from 'rxjs/operators';
import { BarChart, ChartInfo, IDataSample1, IJSONReports, JSONFile, LineChart, SliderInfo } from './data-models/data-models';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { GeneralChartServices, ObservableAsService } from './services/data-service';

@Component({
  templateUrl: './chart-js.html',
  styleUrls: ['./chart-js.css']
})
export class ChartJSComponent implements OnInit, OnDestroy, AfterViewInit {
  // @ViewChild('myIdentifier') myIdentifier: ElementRef;
  breakpoint: number;
  showdata = false;
  forSlider_Min: number;
  forSlider_Max: number;
  forSlider_LatestYear: number;
  forSlider_LatestMonth: number;
  forSlider_1: SliderInfo = {
    id: 1,
    observable: 'Slider_Bar_1'
  };
  data1: IDataSample1[] = [];
  arraydata1: IDataSample1[][] = [];
  dataLine1: LineChart = {};
  d1CI: ChartInfo = {};
  d2CI: ChartInfo = {};
  d3CI: ChartInfo = {};
  titleForCard0 = '';
  titleForCard1 = '';
  titleForCard2 = '';
  error: any;
  headers: string[];
  _jsonFile: JSONFile;
  _jsonBaseURL = '../../assets/json/';
  result = 0;
  Line_Sample1: LineChart[] = [];
  Line_Sample1_Subscription: Subscription;
  Slider_Data_1: SliderInfo = {};
  Slider_Data_1_Subscription: Subscription;
  currentUserSubscription: Subscription;
  Report1: IJSONReports = {
    ReportName: '',
    DateOfReference: '',
    Transport: '',
    PBK: '',
    Connection: '',
    UserName: '',
    UserMachine: ''
  };
  constructor(
    private gcs: GeneralChartServices,
    private breakpointObserver: BreakpointObserver,
    private ds: DataServices,
    private os: OfflineService,
    private OAS: ObservableAsService) {

    this.initilizeAll();
    this.Slider_Data_1_Subscription = this.OAS.ObservableSlider_Bar_1.subscribe(x => {
      // x);
      if (Object.keys(x).length !== 0) {
        this.showdata = false;
        this.Slider_Data_1 = x;
        this.updateData(this.Slider_Data_1);
      }
    });
  }
  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 2;
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 4) ? 1 : 2;
  }
  ngAfterViewInit() {
    // console.log(this.myIdentifier);

    // console.log('height---' + this.myIdentifier.offsetHeight);  //<<<===here
    // console.log('width---' + this.myIdentifier.nativeElement.offsetWidth);    //<<<===here
  }
  ngOnDestroy() {
    if (this.Line_Sample1_Subscription) {
      this.Line_Sample1_Subscription.unsubscribe();
    }
    if (this.Slider_Data_1_Subscription) {
      this.Slider_Data_1_Subscription.unsubscribe();
    }
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }
  initilizeAll() {
    const color = 'hsla(0, 0%, 29%, 0.84';
    this.d1CI.id = 1;
    this.d1CI.type = 'Line';
    this.d1CI.style = color;
    this.d1CI.observable = 'GraphLineVisible1_t1';
    this.d2CI.id = 1;
    this.d2CI.type = 'Bar';
    this.d2CI.style = color;
    this.d2CI.observable = 'GraphBarVisible1_t1';
    this.d3CI.id = 1;
    this.d3CI.type = 'Radar';
    this.d3CI.style = color;
    this.d3CI.observable = 'GraphBarVisible1_t1';
    this.forSlider_Min = 1;
    this.forSlider_Max = 12;
    const d = new Date();
    this.forSlider_LatestYear = d.getFullYear();
    this.forSlider_LatestMonth = d.getMonth() + 1;
    this.forSlider_1.latestmonth = this.forSlider_LatestMonth;
    this.forSlider_1.latestyear = this.forSlider_LatestYear;
    this.forSlider_1.min = this.forSlider_Min;
    this.forSlider_1.max = this.forSlider_Max;
    const rv: string[] = this.gcs.getDateForSlider(this.forSlider_1.latestyear, this.forSlider_1.latestmonth, 0, 'end');
    this.forSlider_1.returneddate = rv[0];
    this.OAS.changeVisibleObservable(this.forSlider_1, this.forSlider_1.observable);
    this.titleForCard0 = 'Cases in Line format as of ' + this.forSlider_1.returneddate + ',0';
    this.titleForCard1 = 'Cases in Bar format as of ' + this.forSlider_1.returneddate + ',1';
    this.titleForCard2 = 'Cases in Radar format as of ' + this.forSlider_1.returneddate + ',2';
    // const fileURL1 = this._jsonBaseURL + 'filename.json';
  }
  updateData(x: SliderInfo) {
    if (typeof this.Report1.DateOfReference === 'undefined') {
      const rv: string[] = this.gcs.getDateForSlider(this.Slider_Data_1.latestyear, this.Slider_Data_1.latestmonth, 0, 'end');
      this.Report1.DateOfReference = rv[0];
    } else {
      this.Report1.DateOfReference = x.returneddate;
    }
    this.Report1.ReportName = 'Cases';
    this.Report1.Transport = '';
    this.Report1.PBK = this.os.getCache('localStorage', 'n', 'string');
    const fileURL1 = this._jsonBaseURL + 'cases.json';
    // // this.Report1);
    this.d1CI.title = this.Report1.ReportName + ' as of ' + this.Report1.DateOfReference;
    this.d2CI.title = this.d1CI.title;
    this.d3CI.title = this.d2CI.title;
    this.titleForCard0 = 'Cases in Line format as of ' + this.Report1.DateOfReference + ',0';
    this.titleForCard1 = 'Cases in Bar format as of ' + this.Report1.DateOfReference + ',1';
    this.titleForCard2 = 'Cases in Radar format as of ' + this.Report1.DateOfReference + ',2';
    setTimeout(() => {
      this.OAS.readJSONToText(fileURL1, this.d1CI.title, 'Line', 1, 'CASES',
        'TIMESTR', 'COUNT', 'GraphLineVisible1_t1', x.value,
        x.latestyear, x.latestmonth, x.returnedyear, x.returnedmonth).subscribe(
          res => {
            this.showdata = true;
          }
        );
    }, 500);
  }
}
