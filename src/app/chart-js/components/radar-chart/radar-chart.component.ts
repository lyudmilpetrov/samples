import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { RadarChart, ChartInfo } from '../../data-models/data-models';
import * as Chart from 'chart.js';
import { ObservableAsService } from '../../services/data-service';
@Component({
    selector: 'app-dashboards-radar-chart',
    templateUrl: './radar-chart.component.html',
    styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() PassedInfo: ChartInfo;
    @ViewChild('Radarchart') RadarchartCanvas: ElementRef<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;
    public chart: Chart;
    public heightDiv = 0;
    public widthDiv = 0;
    Radar_Chart_Data: RadarChart = {};
    Radar_Chart_Data_Subscription: Subscription;
    dataRadar: RadarChart = {};
    colorLetters = 'hsla(360, 100%, 100%, 0.89)';
    constructor(private OAS: ObservableAsService) { }
    ngOnInit() { }
    ngOnDestroy() {
        if (this.Radar_Chart_Data_Subscription) {
            this.Radar_Chart_Data_Subscription.unsubscribe();
        }
    }
    ngAfterViewInit(): void {
        const visualRadarNumber = this.PassedInfo.id;
        const VisualRadarSub = 'Observable' + this.PassedInfo.observable;
        this.Radar_Chart_Data_Subscription = this.OAS[VisualRadarSub].subscribe((x: RadarChart) => {
            if (Object.keys(x).length !== 0) {
                // // // // console.log(this.RadarchartCanvas);
                this.Radar_Chart_Data = x;
                const options = {
                    type: this.PassedInfo.type.toLowerCase(),
                    data: {
                        labels: this.Radar_Chart_Data.labels,
                        datasets: this.Radar_Chart_Data.datasets,
                        fontSize: 11,
                        fontColor: this.colorLetters
                    },
                    options: {
                        responsive: true,
                        responsiveAnimationDuration: 1500,
                        title: {
                            display: true,
                            text: this.Radar_Chart_Data.title,
                            // fontSize: 13,
                            // fontColor: this.colorLetters
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    reverse: false,
                                    // fontColor: this.colorLetters
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    fontColor: this.colorLetters
                                }
                            }]
                        },
                        legend: {
                            labels: {
                                // This more specific font property overrides the global property
                                fontColor: this.colorLetters
                            }
                        }
                    }
                };
                if (typeof this.chart !== 'undefined') {
                    this.chart.clear();
                    this.chart.destroy();
                }
                this.context = this.RadarchartCanvas.nativeElement.getContext('2d');
                this.chart = new Chart(this.context, options);
                Chart.plugins.register({
                    beforeDraw: (ChartInstance) => {
                        const ctx = ChartInstance.chart.ctx;
                        ctx.fillStyle = this.PassedInfo.style;
                        ctx.fillRect(0, 0, ChartInstance.chart.width, ChartInstance.chart.height);
                    }
                });
                const changeItemColor = (item) => {
                    item.scaleLabel.fontColor = this.colorLetters;
                    item.scaleLabel.fontStyle = 'normal';
                    item.ticks.fontColor = this.colorLetters;
                    item.ticks.fontStyle = 'normal';
                    item.ticks.minor.fontColor = this.colorLetters;
                    item.ticks.major.fontColor = this.colorLetters;
                    item.ticks.minor.fontStyle = 'normal';
                    item.ticks.major.fontStyle = 'normal';
                };
                this.chart.options.scales.xAxes.forEach((item) => changeItemColor(item));
                this.chart.options.scales.yAxes.forEach((item) => changeItemColor(item));
                this.chart.options.title.fontColor = this.colorLetters;
                this.chart.options.title.fontStyle = 'normal';
                this.chart.options.legend.fontColor = this.colorLetters;
                this.chart.options.legend.fontStyle = 'normal';
                if (typeof this.chart !== 'undefined') { this.chart.update(); }
            } else {
                if (typeof this.chart !== 'undefined') {
                    this.chart.clear();
                    this.chart.destroy();
                }
            }
        });
    }
    ngOnChanges(changes: SimpleChanges) {
        console.log(this.PassedInfo);
     }
}
