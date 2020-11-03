import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { throwError as observableThrowError, Observable, from, BehaviorSubject, Subject, Subscription, AsyncSubject, of } from 'rxjs';
import { map, filter, scan, catchError, mergeMap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FilesJsonInfo, UserInfo } from 'src/app/shared/globals';
import { BarChart, DataBarChart, DataLineChart, HSLAObject, IDataSample1, IJSONReports, LineChart, RadarChart, SliderInfo } from '../data-models/data-models';
import { Optional } from '@angular/core';
import { SkipSelf } from '@angular/core';
import { DIR_DOCUMENT } from '@angular/cdk/bidi';
@Injectable({ providedIn: 'root' })
export class GeneralChartServices {
    constructor(
        // @Optional() @SkipSelf() parentModule: GeneralChartServices,
        private httpClient: HttpClient
    ) {
        // if (parentModule) {
        //     throw new Error(
        //         'CoreModule is already loaded. Import it in the AppModule only');
        // }
    }
    fileExists(url: string): Observable<boolean> {
        return this.httpClient.get(url).pipe(map(() => true), catchError(() => of(false)));
    }
    getRandomNumber(low: number, high: number) {
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }
    getHSLAColor(h: number, s: number, l: number, a: number) {
        return `hsl(${h}, ${s}%, ${l}%, ${a})`;
    }
    getSimpleRandomColor() {
        const characters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += characters[this.getRandomNumber(0, 15)];
        }
        return color;
    }
    getRandomColor() {
        return Math.floor(0x1000000 * Math.random()).toString(16);
    }
    getHSLARandomColor(h: number[], s: number[], l: number[], a: number[]): HSLAObject {
        const hue = this.getRandomNumber(h[0], h[1]);
        const saturation = this.getRandomNumber(s[0], s[1]);
        const lightness = this.getRandomNumber(l[0], l[1]);
        const alpha = this.getRandomNumber(a[0] * 100, a[1] * 100) / 100;
        const objectR: HSLAObject = {} as HSLAObject;
        objectR.hue = hue;
        objectR.saturation = saturation;
        objectR.lightness = lightness;
        objectR.alpha = alpha;
        objectR.HSLAValue = this.getHSLAColor(hue, saturation, lightness, alpha);
        return objectR;
    }
    getLastDay(yr: number, mm: number): number {
        const d = new Date(yr, mm + 1, 0);
        return d.getDate();
    }
    monthDiff(dateFrom: Date, dateTo: Date): number {
        return dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()));
    }
    getDateForSlider(yr: number, mm: number, mmsback: number, option: string): string[] {
        let dd = 1;
        const d = new Date(yr, (mm - 1), dd);
        d.setMonth(d.getMonth() + mmsback);
        if (option === 'end') {
            dd = this.getLastDay(d.getFullYear(), d.getMonth());
        }
        const df = new Date(d.getFullYear(), d.getMonth(), dd);
        const rdf = ('00' + (df.getMonth() + 1)).slice(-2) + '/' + ('00' + df.getDate()).slice(-2) + '/' + df.getFullYear();
        const yrstr = df.getFullYear().toString();
        const mmstr = (df.getMonth() + 1).toString();
        return [rdf, yrstr, mmstr];
    }
}
@Injectable({ providedIn: 'root' })
export class ObservableAsService {
    GraphLineVisible1_t1: LineChart = {};
    private GraphLineVisible1_t1_Init = new BehaviorSubject<LineChart>(this.GraphLineVisible1_t1);
    ObservableGraphLineVisible1_t1 = this.GraphLineVisible1_t1_Init.asObservable();
    GraphBarVisible1_t1: BarChart = {};
    private GraphBarVisible1_t1_Init = new BehaviorSubject<BarChart>(this.GraphBarVisible1_t1);
    ObservableGraphBarVisible1_t1 = this.GraphBarVisible1_t1_Init.asObservable();
    GraphRadarVisible1_t1: RadarChart = {};
    private GraphRadarVisible1_t1_Init = new BehaviorSubject<RadarChart>(this.GraphRadarVisible1_t1);
    ObservableGraphRadarVisible1_t1 = this.GraphRadarVisible1_t1_Init.asObservable();
    Slider_Bar_1: SliderInfo = {};
    private Slider_Bar_1_Init = new BehaviorSubject<SliderInfo>(this.Slider_Bar_1);
    ObservableSlider_Bar_1 = this.Slider_Bar_1_Init.asObservable();
    constructor(
        // @Optional() @SkipSelf() parentModule: ObservableAsService,
        private gs: GeneralChartServices, private httpClient: HttpClient
    ) {
        // if (parentModule) {
        //     throw new Error(
        //         'CoreModule is already loaded. Import it in the AppModule only');
        // }
    }
    changeVisibleObservable(...args: [d: LineChart | BarChart | SliderInfo, k: string]) {
        this[args[1]] = args[0];
        this[args[1] + '_Init'].next(this[args[1]]);
        // // // console.log(this.GraphBarVisible1_t1);
        this.GraphBarVisible1_t1_Init.next(this.GraphBarVisible1_t1);
        // // // // console.log(this[args[1]]);
        // // // // console.log(this[args[1] + '_Init']);
    }
    readJSONToText(
        fileURL: string, charttitle: string, charttype: string,
        chartid: number, keyfordatasets: string, keyforlables: string,
        keyforpresenteddata: string,
        observablename: string, limit: number,
        latestyear: number, latestmonth: number,
        returnedyear: number, returnedmonth: number): Observable<string> {
        // // // // console.log(observablename);
        // // // // // console.log(fileURL);
        return new Observable(observer => {
            this.gs.fileExists(fileURL).subscribe(x => {
                if (x) {
                    this.httpClient.get(fileURL).subscribe(d => {
                        const l = limit || 1;
                        const yr = returnedyear || latestyear;
                        const mm = returnedmonth || latestmonth;
                        const dd: IDataSample1[] = (JSON.parse(JSON.stringify(d))).filter(xd => xd.FILE === l);
                        dd.map(
                            xdd => {
                                const rv: string[] = this.gs.getDateForSlider(yr, mm, -(xdd.TIME - 1), 'end');
                                xdd.TIMESTR = rv[0];
                            }
                        );
                        const lO: LineChart = this.convertToLineChart(JSON.parse(JSON.stringify(dd)), charttitle, charttype,
                            chartid, keyfordatasets, keyforlables, keyforpresenteddata);
                        this.changeVisibleObservable(lO, 'GraphLineVisible1_t1');
                        const bO: BarChart = this.convertToBarChart(JSON.parse(JSON.stringify(dd)), charttitle, 'Bar',
                            chartid, keyfordatasets, keyforlables, keyforpresenteddata);
                        this.changeVisibleObservable(bO, 'GraphBarVisible1_t1');
                        observer.next('file loaded');
                    });
                } else {
                    const lO: LineChart = this.convertToLineChart([], charttitle, charttype,
                        chartid, keyfordatasets, keyforlables, keyforpresenteddata);
                    this.changeVisibleObservable(lO, 'GraphLineVisible1_t1');
                    const bO: BarChart = this.convertToBarChart([], charttitle, 'Bar',
                        chartid, keyfordatasets, keyforlables, keyforpresenteddata);
                    this.changeVisibleObservable(bO, 'GraphBarVisible1_t1');
                    observer.next('file missing');
                }
            });
        });
    }
    getJSONFromServer(report: IJSONReports) {
        const url = '';
        // // // console.log(url);
        return this.httpClient.post(url, report).pipe(map((r: string) => {
            return r;
        }
        ), catchError((e: any) => observableThrowError(e)));
    }
    getUserInfo(api: string, user: UserInfo): Observable<UserInfo> {
        const url = api + '?u=u';
        return this.httpClient.post(url, user).pipe(map((r: string) => {
            // // // // // // // // // // // // // // // // // // // // // // console.log(r);
            if (r === '') {
                return r;
            } else {

                return JSON.parse(r)[0];
            }
        }
        ), catchError((e: any) => observableThrowError(e)));
    }
    convertToLineChart(
        data: IDataSample1[], charttitle: string,
        charttype: string, chartid: number,
        keyfordatasets: string, keyforlables: string, keyforpresenteddata: string): LineChart {
        const dataLine: LineChart = {};
        dataLine.datasets = [];
        const datasetsInfo = [...new Set(data.map(x => x[keyfordatasets]))].filter(x => x !== undefined);
        // console.log(datasetsInfo);
        // console.log(['keyfordatasets', keyfordatasets]);
        const lables = [...new Set(data.map(x => {
            if (x[keyfordatasets] === datasetsInfo[0]) {
                return x[keyforlables];
            }
        }
        ))].filter(x => x !== undefined);
        // console.log(lables);
        dataLine.labels = lables;
        const baseColorStep = 360 / datasetsInfo.length;
        let cI = 0;
        datasetsInfo.map(y => {
            const datasetsForDataLine: DataLineChart = {};
            const dataN = [];
            data.map(x => {
                if (x[keyfordatasets] === y) {
                    dataN.push(x[keyforpresenteddata]);
                    datasetsForDataLine.label = y;
                }
            });
            datasetsForDataLine.data = dataN;
            datasetsForDataLine.fill = true;
            // https://www.kirupa.com/html5/generating_random_colors.htm
            // hue saturation lightness alpha
            // hue is actual color like color see article
            const h_range = [cI * baseColorStep, ((cI + 1) * baseColorStep) - 1];
            const s_range = [70, 80];
            const l_range = [70, 80];
            const a_range = [1, 1];
            const baseColor = this.gs.getHSLARandomColor(h_range, s_range, l_range, a_range);
            cI += 1;
            datasetsForDataLine.borderColor = baseColor.HSLAValue;
            dataLine.datasets.push(datasetsForDataLine);
        });
        dataLine.index = chartid;
        dataLine.title = charttitle;
        return dataLine;
    }
    convertToBarChart(
        data: IDataSample1[], charttitle: string,
        charttype: string, chartid: number, keyfordatasets: string, keyforlables: string, keyforpresenteddata: string): BarChart {
        const dataBar: BarChart = {};
        dataBar.datasets = [];
        const datasetsInfo = [...new Set(data.map(x => x[keyfordatasets]))].filter(x => x !== undefined);
        const lables = [...new Set(data.map(x => {
            if (x[keyfordatasets] === datasetsInfo[0]) {
                return x[keyforlables];
            }
        }
        ))].filter(x => x !== undefined);
        dataBar.labels = lables;
        datasetsInfo.map(y => {
            const datasetsForDataBar: DataBarChart = {};
            datasetsForDataBar.borderColor = [];
            datasetsForDataBar.backgroundColor = [];
            const dataN = [];
            data.map(x => {
                if (x[keyfordatasets] === y) {
                    dataN.push(x[keyforpresenteddata]);
                    datasetsForDataBar.label = y;
                }
            });
            datasetsForDataBar.data = dataN;
            datasetsForDataBar.fill = true;
            dataBar.datasets.push(datasetsForDataBar);
        });
        const baseColorStep = 360 / datasetsInfo.length;
        let cI = 0;
        dataBar.datasets.map(x => {
            datasetsInfo.map(y => {
                if (y === x.label) {
                    const h_range = [cI * baseColorStep, ((cI + 1) * baseColorStep) - 1];
                    const s_range = [70, 80];
                    const l_range = [70, 80];
                    const a_range = [1, 1];
                    const baseColor1 = this.gs.getHSLARandomColor(h_range, s_range, l_range, a_range);
                    const baseColor2 = this.gs.getHSLAColor(baseColor1.hue, baseColor1.saturation, baseColor1.lightness, 0.3);
                    x.borderColor = baseColor1.HSLAValue;
                    x.backgroundColor = baseColor2;
                    x.borderWidth = 1;
                    cI += 1;
                }
            });
        });
        dataBar.title = charttitle;
        dataBar.index = chartid;
        return dataBar;
    }
}

