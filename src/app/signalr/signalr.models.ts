import { Injectable, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum ConnectionState {
    Connecting = 1,
    Connected = 2,
    Reconnecting = 3,
    Disconnected = 4
}
export class ChannelEvent {
    Name: string;
    ChannelName: string;
    Timestamp: string;
    Data: {
        State: string,
        PercentComplete: number,
        FileNames?: string[],
        json: string
    };
    Json: string;
    constructor() {
        this.Timestamp = new Date().toISOString();
    }
}

export class ChannelSubject {
    channel: string;
    subject: Subject<ChannelEvent>;
}
