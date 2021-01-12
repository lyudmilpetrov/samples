import { Component, OnInit, Input, Output, EventEmitter, Optional, SkipSelf } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {
  HttpClient, HttpResponse, HttpRequest,
  HttpEventType, HttpErrorResponse
} from '@angular/common/http';
import { Subscription } from 'rxjs';
import { of } from 'rxjs';
import { catchError, last, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 100 })),
      transition('* => void', [
        animate(300, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FileUploadComponent implements OnInit {

  /** Link text */
  @Input() text = 'Upload';
  /** Name used in form which will be sent in HTTP request. */
  @Input() param = 'file';
  /** Target URL for file uploading. */
  @Input() target = 'https://file.io';
  /** File extension that accepted, same as 'accept' of <input type="file" />. By the default, it's set to 'image/*'. */
  @Input() accept = 'image/*';
  /** Allow you to add handler after its completion. Bubble up response text from remote. */
  // tslint:disable-next-line: no-output-native
  @Output() complete = new EventEmitter<object>();

  files: Array<FileUploadModel> = [];
  constructor(
    @Optional() @SkipSelf() parentModule: FileUploadComponent,
    private http: HttpClient) { }

  ngOnInit() { }

  public onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    // const fileReader = document.getElementById('FileReader') as HTMLInputElement;
    const reader = new FileReader();
    fileUpload.onchange = () => {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        const readed = reader.readAsDataURL(file);
        reader.onload = (event) => {
          const filenew = {
            data: file, state: 'in', result: event.target.result,
            inProgress: false, progress: 0, canRetry: false, canCancel: true
          };
          this.files.push(filenew);
          // console.log(filenew);
          this.complete.emit(filenew);
        };
        // // console.log(file);
        // this.files.push({
        //     data: file, state: 'in', result: '',
        //     inProgress: false, progress: 0, canRetry: false, canCancel: true
        // });
      }
      // this.uploadFiles();
    };
    fileUpload.click();
  }

  cancelFile(file: FileUploadModel) {
    file.sub.unsubscribe();
    this.removeFileFromArray(file);
  }

  retryFile(file: FileUploadModel) {
    this.uploadFile(file);
    file.canRetry = false;
  }

  private uploadFile(file: FileUploadModel) {
    const fd = new FormData();
    fd.append(this.param, file.data);
    // console.log(file);
    const req = new HttpRequest('POST', this.target, fd, {
      reportProgress: true
    });

    file.inProgress = true;
    file.sub = this.http.request(req).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total);
            break;
          case HttpEventType.Response:
            return event;
        }
      }),
      tap(message => { }),
      last(),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        file.canRetry = true;
        return of(`${file.data.name} upload failed.`);
      })
    ).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {
          this.removeFileFromArray(file);
          this.complete.emit(file);
        }
      }
    );
  }

  private uploadFiles() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.value = '';

    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  private removeFileFromArray(file: FileUploadModel) {
    const index = this.files.indexOf(file);
    if (index > -1) {
      this.files.splice(index, 1);
    }
  }

}

export class FileUploadModel {
  data: File;
  result: string | ArrayBuffer;
  state: string;
  inProgress: boolean;
  progress: number;
  canRetry: boolean;
  canCancel: boolean;
  sub?: Subscription;
}
