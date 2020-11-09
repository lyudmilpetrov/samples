import { Observable, Subject, Subscription } from 'rxjs';
// https://blog.logrocket.com/how-to-execute-a-function-with-a-web-worker-on-a-different-thread-in-angular/
export class WebWorker {
    private readonly worker: Worker;
    private onMessage = new Subject<MessageEvent>();
    private onError = new Subject<ErrorEvent>();
    constructor(func) {
        const WORKER_ENABLED = !!(Worker);
        if (WORKER_ENABLED) {
            const functionBody = func.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
            this.worker = new Worker(URL.createObjectURL(
                new Blob([functionBody], { type: 'text/javascript' })
            ));
            this.worker.onmessage = (data) => {
                this.onMessage.next(data);
            };
            this.worker.onerror = (data) => {
                this.onError.next(data);
            };
        } else {
            throw new Error(`Web worker is not enabled`);
        }
    }
    postMessage(data) {
        this.worker.postMessage(data);
    }
    onmessage(): Observable<MessageEvent> {
        return this.onMessage.asObservable();
    }
    onerror(): Observable<ErrorEvent> {
        return this.onError.asObservable();
    }
    terminate() {
        if (this.worker) { this.worker.terminate(); }
    }
}
