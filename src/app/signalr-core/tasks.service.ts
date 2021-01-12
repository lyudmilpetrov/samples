import { EventEmitter, Injectable, Inject, OnDestroy } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, from, of, forkJoin, Subject, interval, Subscription, BehaviorSubject } from 'rxjs';
import { ConnectionState, ChannelSubject, ChannelEvent } from '@app/signalr-core/signalr.models';
import { OfflineService, DataServices } from '@app/services/services';
import { Globals, UserInfo } from '@app/shared/globals';

@Injectable({ providedIn: 'root' })
export class TasksService implements OnDestroy {
  // ///////// Subscriptions
  currentUserSubscription: Subscription;
  currentUser: UserInfo = {
    id: '',
    fullname: '',
    name: '',
    pass: '',
    division: '',
    pmrights: '',
    brights: '',
    crights: '',
    lrights: '',
    parights: '',
    adm: '',
    internet: '',
    apipoint: '',
    signalrapipoint: '',
    connectionname: '',
    connectionnameland: '',
    connectionnamestaff: '',
    n: '',
    signalrconnectionid: ''
  };

  /**
   * starting$ is an observable available to know if the signalr
   * connection is ready or not. On a successful connection this
   * stream will emit a value.
   */
  starting$: Observable<string>;
  /**
   * connectionState$ provides the current state of the underlying
   * connection as an observable stream.
   * connecting = 1
   * connected = 2
   * reconecting = 3
   * disconected = 4
   */
  connectionStateNumber: ConnectionState = 4;
  connectionState$: Observable<ConnectionState>;
  connectionID$: Observable<string>;
  /**
   * error$ provides a stream of any error messages that occur on the
   * SignalR connection
   */
  error$: Observable<any>;
  // These are used to feed the public observables
  //

  private connectionStateSubject = new Subject<ConnectionState>();
  private connectionStateInit = new BehaviorSubject<ConnectionState>(this.connectionStateNumber);
  connectionState = this.connectionStateInit.asObservable();
  private connectionIDSubject = new Subject<string>();
  private startingSubject = new Subject<string>();
  private errorSubject = new Subject<any>();
  // These are used to track the internal SignalR state
  //
  private hubConnection: HubConnection;
  private connectionIsEstablished = false;
  // An internal array to track what channel subscriptions exist
  //
  private subjects = new Array<ChannelSubject>();
  MessageReceived = new EventEmitter<string>();
  ConnectionEstablished = new EventEmitter<boolean>();
  constructor(
    private os: OfflineService,
    private ds: DataServices,
    public globals: Globals
  ) {
    this.connectionState$ = this.connectionStateSubject.asObservable();
    this.error$ = this.errorSubject.asObservable();
    this.starting$ = this.startingSubject.asObservable();
    this.connectionID$ = this.connectionIDSubject.asObservable();
    this.currentUserSubscription = this.ds.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }
  initilizeSignalR(serverapi: string, hub: string) {
    this.globals.incrementQuestionNumber();
    if (this.globals.counterNumberForSignalR <= 2) {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(serverapi + hub)
        .withAutomaticReconnect([30, 30, 30, 30])
        .build();
      // // this.hubConnection);
      // define handlers for the connection state events
      // // console.log(this.hubConnection);
      let priorEV = '';
      this.hubConnection.onreconnecting((error) => {
        // // error);
        this.connectionState$ = of(ConnectionState.Reconnecting);
        this.connectionStateInit.next(ConnectionState.Reconnecting);
        this.error$ = of(error);
      });
      this.hubConnection.onreconnected((connectionid) => {
        this.connectionState$ = of(ConnectionState.Connected);
        this.connectionStateInit.next(ConnectionState.Connected);
        this.connectionID$ = of(connectionid);
      });
      this.hubConnection.onclose(() => {
        this.connectionState$ = of(ConnectionState.Disconnected);
        this.connectionStateInit.next(ConnectionState.Disconnected);
        this.connectionID$ = of('');
      });
      this.hubConnection.on('onEvent', (channel: string, ev: ChannelEvent) => {
        // // // // // // // // `onEvent - ${channel} channel`, ev);
        // This method acts like a broker for incoming messages. We
        //  check the interal array of subjects to see if one exists
        //  for the channel this came in on, and then emit the event
        //  on it. Otherwise we ignore the message.
        //
        // // // // // // // // this.subjects);
        const channelSub = this.subjects.find((x: ChannelSubject) => {
          return x.channel === channel;
        }) as ChannelSubject;
        // // // // // // // // channelSub);
        // If we found a subject then emit the event on it
        //
        if (channelSub !== undefined) {
          if (JSON.stringify(ev.Data) !== priorEV) {
            channelSub.subject.next(ev);
            priorEV = JSON.stringify(ev.Data);
          }
        }
      });
      this.hubConnection.on('ReceiveConnectionID', (id: string) => {
        this.os.setCache('sessionStorage', 'cid', id, 'string');
      });
      this.hubConnection.on('Send', (id: string) => {

      });
      this.hubConnection.on('Subscribed', (ev: ChannelEvent) => {
        // console.log(ev);
      });
      // this.start('machine', 'encrkye');
      this.startConnection();
    }
  }
  start(machine: string, encrkey: string) {
    this.hubConnection.start()
      // .then()
      .finally(() => {
        this.hubConnection.invoke('RegisterUser', machine, encrkey);
        this.connectionState$ = of(ConnectionState.Connected);
      }).catch((error) => {
        // // console.log(error);
        this.error$ = of(error);
      });
  }
  sub(channel: string): Observable<ChannelEvent> {
    // Try to find an observable that we already created for the requested channel
    // // 'Subscribing entry for channel - ' + channel);
    // // this.subjects);
    // // this.getConnetionState());
    let channelSub = this.subjects.find((x: ChannelSubject) => {
      return x.channel === channel;
    }) as ChannelSubject;
    // // // // // // // channelSub);
    // If we already have one for this event, then just return it
    if (typeof channelSub !== 'undefined') {
      // // // // // // // `Found existing observable for ${channel} channel`);
      // // // // // // // this.hubProxy);
      return channelSub.subject.asObservable();
    }
    channelSub = new ChannelSubject();
    channelSub.channel = channel;
    channelSub.subject = new Subject<ChannelEvent>();
    this.subjects.push(channelSub);
    this.hubConnection.invoke<ChannelEvent>('Subscribe', channel);
    return channelSub.subject.asObservable();
  }
  sendMessage(message: string) {
    this.hubConnection.invoke('SendMessage', message);
  }
  getConnetionState(): number {
    this.connectionState$ = of(ConnectionState[this.hubConnection.state]);
    return ConnectionState[this.hubConnection.state];
  }
  private createConnection(hubname: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(window.location.href + hubname)
      .build();
  }
  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        this.connectionIsEstablished = true;
        this.ConnectionEstablished.emit(true);
        // this.connectionState$ = of(ConnectionState.Connected);
        this.connectionStateInit.next(ConnectionState.Connected);
        // console.log(this.getConnetionState());
      })
      .catch(err => {
        setTimeout(() => {
          this.startConnection();
        }, 5000);
      });
  }
  private registerOnserverEvents(): void {
    this.hubConnection.on('MessageReceived', (data: any) => {
      this.MessageReceived.emit(data);
    });
  }
  ngOnDestroy() {
    if (this.currentUserSubscription) {
      this.currentUserSubscription.unsubscribe();
    }
  }
}
