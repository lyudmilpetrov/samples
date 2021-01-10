import { Component, Input, Output, EventEmitter, OnInit, Optional, SkipSelf, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserInfo } from '../../shared/globals';
// import { ChannelService, ChannelEvent } from '../../services/signalr/channel-services';
import { TasksService } from '../../signalr-core/tasks.service';
import { ChannelEvent } from '../../signalr-core/signalr.models';
import { Observable, Subscription } from 'rxjs';
import { map, filter, scan, catchError, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: './app-progress-info',
  templateUrl: './progress-info.html'
})
export class ProgressInfoComponent implements OnInit, OnDestroy, OnChanges {
  server: string;
  apiUrl: string;
  private channel = 'tasks';
  private connectionState = 4;
  @Input() sentToSignalRChannel = '';
  @Output() outputmessageEvent = new EventEmitter<ChannelEvent>();
  sentFromServer: ChannelEvent;
  user: UserInfo;
  //////////////////////// Subscriptions
  connectionSrtate: Subscription;
  constructor(
    @Optional() @SkipSelf() parentModule: ProgressInfoComponent,
    private channelService: TasksService,
    private http: HttpClient
  ) {
    this.connectionSrtate = this.channelService.connectionState.subscribe(c => {
      if (c === 2) {
        this.connectionState = c;
        this.subscribeToChannel(this.sentToSignalRChannel);
      }
    });
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
  ngOnChanges() {
    // // // // // console.log('Progress info ngOnChanges - ' + this.sentToSignalRChannel);
    if (this.sentToSignalRChannel.length > 0) {
      this.channel = this.sentToSignalRChannel;
    }
  }
  ngOnInit() {
    this.server = window.location.origin;
  }
  subscribeToChannel(channel: string) {
    if (this.connectionState === 2) {
      this.channelService.sub(channel).subscribe(
        (x: ChannelEvent) => {
          // // // // // // console.log('Subscribed');
          console.table(x);
          this.sentFromServer = x;
          this.outputmessageEvent.emit(this.sentFromServer);
        },
        (error: any) => {
          console.warn('Attempt to join channel failed!', error);
        }
      );
    }
  }
  ngOnDestroy() {
    if (this.connectionSrtate) {
      this.connectionSrtate.unsubscribe();
    }
  }
}
