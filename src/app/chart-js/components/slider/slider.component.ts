import { Component, ChangeDetectionStrategy, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { SliderInfo } from '../../../shared/data-models';
import { Subscription } from 'rxjs';
import { GeneralChartServices, ObservableAsService } from '../../../services/data-services';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-dashboards-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, OnDestroy {
    @Input() id: SliderInfo;
    @Output() messageToEmit = new EventEmitter<string>();
    @ViewChild('slider') slider;
    Slider_Data: SliderInfo = {};
    Slider_Data_Subscription: Subscription;
    SliderObservable: string;
    SliderObservableName: string;
    constructor(private OAS: ObservableAsService, private gcs: GeneralChartServices
    ) { }
    ngOnInit() {
        this.Slider_Data = this.id;
        this.SliderObservable = 'Observable' + this.id.observable;
        this.SliderObservableName = this.id.observable;
    }
    ngOnDestroy() {
        if (this.Slider_Data_Subscription) {
            this.Slider_Data_Subscription.unsubscribe();
        }
    }
    formatLabel(value) {
        // // // console.log(value);
        if (value === 1) {
            this.slider._value = 'dddd';
            return this.slider._value;
        } else {
            return value;
        }
    }
    onInputChange(event: MatSliderChange) {
        const i = event.value;
        // // // // i);
        // // // // this.id);
        const rv: string[] = this.gcs.getDateForSlider(this.id.latestyear, this.id.latestmonth, -(i - 1), 'end');
        this.slider._value = rv[0];
        if (typeof this.Slider_Data.returneddate === 'undefined' || this.Slider_Data.returneddate !== rv[0]) {
            this.Slider_Data = this.id;
            this.Slider_Data.returneddate = rv[0];
            this.Slider_Data.returnedyear = +rv[1];
            this.Slider_Data.returnedmonth = +rv[2];
            this.Slider_Data.value = i;
            this.OAS.changeVisibleObservable(this.Slider_Data, this.SliderObservableName);
        }
    }
}
