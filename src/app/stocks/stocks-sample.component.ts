import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartInfo, IDataSample1, IJSONReports, JSONFile, LineChart, SliderInfo, Stock } from '../shared/data-models';
import { ApiStocksServices, GeneralChartServices, ObservableAsService } from '../services/data-services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Chart from 'chart.js';
@Component({
  templateUrl: 'stocks-sample.html',
  styleUrls: ['stocks-sample.css']
})
export class StocksSampleComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('linechart') linechartCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  public chart: Chart;
  Exchanges = new FormControl('', [Validators.required]);
  exchange = '';
  Symbol = new FormControl('', [Validators.required]);
  StockForm = new FormGroup({
    Exchanges: this.Exchanges,
    Symbols: this.Symbol
  });
  AllStocks: Stock[] = [];
  AllUniqueExchanges: string[] = [];
  AllSymbols: string[] = [];
  showdata = false;
  Line_Chart_Data: LineChart = {};
  colorLetters = 'hsla(360, 100%, 100%, 0.89)';
  constructor(
    private gcs: GeneralChartServices,
    private OAS: ObservableAsService,
    private api: ApiStocksServices) {
    this.api.getAllActiveStocks().subscribe(x => {
      this.AllStocks = x;
      this.AllUniqueExchanges = [...new Set(this.AllStocks.map(s => s.exchange))];
      this.showdata = true;
    })
  }
  ngOnInit() {
    this.StockForm.get('Exchanges').valueChanges.subscribe(value => {
      // console.log(value);
      this.exchange = value;
      this.AllSymbols = [...new Set(this.AllStocks.map(s => {
        if (s.exchange === value) {
          if (s.symbol.trim().length >= 3) {
            return s.symbol.trim();
          }
        }
      }))];
    })
    this.StockForm.get('Symbols').valueChanges.subscribe(value => {
      this.api.getDailyDataStocks(value).subscribe(x => {
        this.Line_Chart_Data = this.OAS.convertToLineChartFromStockData(x[value], 'Daily info high and low prices for Exchange ' + this.exchange + ' for stock ' + value, ['h', 'l']);
        const options = {
          type: 'line',
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
        // console.log(options);
        Chart.plugins.register({
          beforeDraw: (ChartInstance) => {
            const ctx = ChartInstance.chart.ctx;
            ctx.fillStyle = 'hsla(0, 0%, 29%, 0.84)';
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
      });
    })
  }
  ngAfterViewInit() {

  }
  ngOnDestroy() {

  }
}
