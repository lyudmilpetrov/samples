import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BarChart, ChartInfo, LineChart, SliderInfo } from '../../data-models/data-models';
import * as Chart from 'chart.js';
import { ObservableAsService } from '../../services/data-service';
@Component({
    selector: 'app-dashboards-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    @Input() PassedInfo: ChartInfo;
    @ViewChild('linechart') linechartCanvas: ElementRef<HTMLCanvasElement>;
    public context: CanvasRenderingContext2D;
    public chart: Chart;
    public heightDiv = 0;
    public widthDiv = 0;
    Line_Chart_Data: LineChart = {};
    Line_Chart_Data_Subscription: Subscription;
    colorLetters = 'hsla(360, 100%, 100%, 0.89)';
    Slider_Data_1: SliderInfo = {};
    Slider_Data_1_Subscription: Subscription;
    constructor(private OAS: ObservableAsService) { }
    ngOnInit() { }
    ngOnDestroy() {
        if (this.Line_Chart_Data_Subscription) {
            this.Line_Chart_Data_Subscription.unsubscribe();
        }
    }
    ngAfterViewInit(): void {
        this.Slider_Data_1_Subscription = this.OAS.ObservableSlider_Bar_1.subscribe(x => {
            if (Object.keys(x).length !== 0) {
                this.Slider_Data_1 = x;
                // // console.log(this.Slider_Data_1);
            }
        });
        // // // // // console.log(this.PassedInfo);
        const visualLineNumber = this.PassedInfo.id;
        const VisualLineSub = 'Observable' + this.PassedInfo.observable;
        // // // // // console.log(VisualLineSub);
        this.Line_Chart_Data_Subscription = this.OAS[VisualLineSub].subscribe((x: LineChart) => {
            // console.log(x);
            if (Object.keys(x).length !== 0) {
                this.Line_Chart_Data = x;
                const options = {
                    type: this.PassedInfo.type.toLowerCase(),
                    data: {
                        labels: this.Line_Chart_Data.labels,
                        datasets: this.Line_Chart_Data.datasets,
                        fontSize: 11,
                        fontColor: this.colorLetters
                    },
                    options: {
                        responsive: true,
                        responsiveAnimationDuration: 1500,
                        title: {
                            display: true,
                            text: this.Line_Chart_Data.title,
                            fontSize: 13,
                            fontColor: this.colorLetters
                        },
                        scales: {
                            yAxes: [{
                                scaleLablel: {
                                    // To format scale label
                                    fontColor: this.colorLetters
                                },
                                ticks: {
                                    reverse: false,
                                    fontColor: this.colorLetters
                                }
                            }],
                            xAxes: [{
                                scaleLablel: {
                                    // To format scale label
                                    fontColor: this.colorLetters
                                },
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
                this.context = this.linechartCanvas.nativeElement.getContext('2d');
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
                // // // console.log(this.chart.options.scales.xAxes);
                // // // console.log(this.chart.options.scales.xAxes);
                this.chart.options.scales.xAxes.forEach((item) => changeItemColor(item));
                this.chart.options.scales.yAxes.forEach((item) => changeItemColor(item));
                this.chart.options.title.fontColor = this.colorLetters;
                this.chart.options.title.fontStyle = 'normal';
                this.chart.options.legend.fontColor = this.colorLetters;
                this.chart.options.legend.fontStyle = 'normal';
                if (typeof this.chart !== 'undefined') { this.chart.update(); }
                console.log(this.chart);
            } else {
                if (typeof this.chart !== 'undefined') {
                    this.chart.clear();
                    this.chart.destroy();
                }
            }
        });
    }
    ngOnChanges(changes: SimpleChanges) { }
}
