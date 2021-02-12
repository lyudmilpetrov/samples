import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, Renderer2, NgZone, Inject } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploadComponent } from '@app/components/file-upload/file-upload.component';
import { OverlayMessageComponent } from '@app/components/overlay-message/overlay-message.component';
import { TOASTR_TOKEN, Toastr } from '@app/services/toastr.service';
import * as faceapi from 'face-api.js';
import { GenericServices, OfflineService } from '../services/services';
import { WebWorker } from './web_worker';
// https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API
// https://school.geekwall.in/p/Hy29kFEGm/face-recognition-in-the-browser-with-tensorflow-js-javascript
// https://rubikscode.net/2019/09/09/integration-of-tensorflow-model-into-angular-application/
export interface IMtcnnOptions {
  minFaceSize?: number;
  scaleFactor?: number;
  maxNumScales?: number;
  scoreThresholds?: number[];
  scaleSteps?: number[];
}
export interface IDimensions {
  width: number;
  height: number;
}
export interface LabeledFaceDescriptors {
  _label: string;
  _descriptors: Float32Array[];
  _dimensions: IDimensions;
}
@Component({
  templateUrl: './face-recognition.html',
  styleUrls: ['./face-recognition.css'],
  // // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaceRecognitionComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('c1', { static: true }) c1: MatCard;
  @ViewChild('canvasLast', { static: true }) canvasLast: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasPrior', { static: true }) canvasPrior: ElementRef<HTMLCanvasElement>;
  @ViewChild('second') secondUpload: FileUploadComponent;
  MODEL_URL = '../../assets/weights';
  constraints = {
    // video: true
    // “selfie”
    audio: false,
    video: {
      facingMode: 'selfie',
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };
  mtcnnForwardParams: IMtcnnOptions = {
    // mininum face size to expect, the higher the faster processing will be,
    // but smaller faces won't be detected
    minFaceSize: 200,
    // scale factor used to calculate the scale steps of the image
    // pyramid used in stage 1
    scaleFactor: 0.709,
    // number of scaled versions of the input image passed through the CNN
    // of the first stage, lower numbers will result in lower inference time,
    // but will also be less accurate
    maxNumScales: 10,
    // the score threshold values used to filter the bounding
    // boxes of stage 1, 2 and 3
    scoreThresholds: [0.6, 0.7, 0.7]
  };
  videoWidth = 0;
  videoHeight = 0;
  result = 0;
  valueInput = '';
  images = [];
  matched = 'These faces belong to different people!';
  maxDescriptorDistance = 0.4;
  IsWait = false;
  breakpoint: number;
  switchimage = 1;
  showUpload = false;
  text = 'Allow the browser to use your camera and click on video to capture image or press buttons below, or either click on image holders on the left/below. The demo uses only browsers computing power, now backend server';
  mobileHide = false;
  screenWidth: any;
  screenHeight: any;
  cameraOn = true;
  constructor(
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    private renderer: Renderer2,
    private os: OfflineService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private ngZone: NgZone,
    private gs: GenericServices) { }
  ngOnInit() {
    if (window.location.hostname === 'localhost') {
      this.showUpload = true;
    } else {
      this.showUpload = false;
    }
    if (this.gs.checkIfMobile()) {
      this.constraints.video.facingMode = 'user';
      this.text = 'Allow the browser to use your camera and tap on the video to capture image. The demo uses only browsers computing power, now backend server';
      this.mobileHide = true;
    }
    console.log(faceapi);
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 2;
    // this.openDialog();
    Promise.all([
      this.loadF(this.MODEL_URL, 'loadSsdMobilenetv1Model')
        .then(x => {
          console.log(x);
        })
        .catch(err => { console.log(err); })
        .finally(() => { console.log('done'); }),
      this.loadF(this.MODEL_URL, 'loadFaceDetectionModel').then(x => {
        console.log(x);
      })
        .catch(err => { console.log(err); })
        .finally(() => { console.log('done'); }),
      this.loadF(this.MODEL_URL, 'loadFaceLandmarkModel').then(x => {
        console.log(x);
      })
        .catch(err => { console.log(err); })
        .finally(() => { console.log('done'); }),
      this.loadF(this.MODEL_URL, 'loadFaceRecognitionModel').then(x => {
        console.log(x);
      })
        .catch(err => { console.log(err); })
        .finally(() => { console.log('done'); })
    ]).then((values) => {
      console.log(values);
    }).catch(err => console.log(err)).finally(() => {
      console.log('done loading');
      console.log(faceapi);
    });
    this.startCamera();
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 4) ? 1 : 2;
    this.screenWidth = window.innerWidth;

    this.screenHeight = window.innerHeight;
  }
  async loadF(url: string, call: string) {
    await faceapi[call](url);
  }
  // handleError(error) {
  //   console.log('Error: ', error);
  //   // this.cameraOn = false;
  //   // this.toastr.options.positionClass = 'toast-top-center';
  //   // this.toastr.error(error, 'Issue!');
  // }
  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
    console.log(this.videoHeight);
  }
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(() => {
        this.toastr.options.positionClass = 'toast-top-center';
        this.toastr.error('No camera found!', 'Issue!');
      });
    }
  }
  captureImageFirst() {
    this.renderer.setProperty(this.canvasLast.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvasLast.nativeElement, 'height', this.videoHeight);
    this.canvasLast.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
  }
  captureImageSecond() {
    this.renderer.setProperty(this.canvasPrior.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvasPrior.nativeElement, 'height', this.videoHeight);
    this.canvasPrior.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
  }
  capture() {
    if (this.switchimage === 1) {
      this.switchimage = 2;
      this.captureImageFirst();
    } else {
      this.switchimage = 1;
      this.captureImageSecond();
    }
  }
  async compareImages() {
    this.IsWait = true;
    this.ngZone.run(() => {
      this.IsWait = true;
    });
    setTimeout(async () => {
      const x = await this.computeSingleFaceDescriptors(
        this.canvasLast.nativeElement,
        this.canvasPrior.nativeElement,
        'Lyudmil', this.videoHeight,
        this.videoWidth);
      console.log(x);
      if (x <= this.maxDescriptorDistance) {
        this.matched = 'The faces belong to one person!';
        this.openDialog(this.matched);
        this.IsWait = false;
      } else {
        this.matched = 'It is hard to tell if that is the same person!';
        this.openDialog(this.matched);
        this.IsWait = false;
      }
    }, 20);
    // Promise.all([
    //     // this.loadF(this.MODEL_URL, 'loadSsdMobilenetv1Model'),
    //     this.loadF(this.MODEL_URL, 'loadFaceDetectionModel'),
    //     this.loadF(this.MODEL_URL, 'loadFaceLandmarkModel'),
    //     this.loadF(this.MODEL_URL, 'loadFaceRecognitionModel')
    // ]).then((values) => {
    //     console.log(values);
    //     calc(this);
    // })
    //     .catch(err => console.log(err))
    //     .finally(() => {
    //         console.log('done loading');
    //         console.log(faceapi);
    //         // calc(this);
    //     });
    // async function calc(t: any) {
    //     const x = await t.computeSingleFaceDescriptors(
    //         t.canvasLast.nativeElement,
    //         t.canvasPrior.nativeElement,
    //         'Lyudmil', t.videoHeight,
    //         t.videoWidth);
    //     console.log(x);
    //     if (x <= t.maxDescriptorDistance) {
    //         t.matched = 'The faces belong to one person!';
    //         t.openDialog(t.matched);
    //     }
    //     t.IsWait = false;
    // }
    // const imagebase64data = imageprior;
    // setTimeout(async () => {
    //     this.IsWait = true;
    // }, 200);
  }
  // The neural nets accept HTML image, canvasLast or video elements or tensors as inputs.
  async computeSingleFaceDescriptors(
    canvaslast: any, canvasprior: any, name: string,
    h: number, w: number): Promise<number> {
    // this.IsWait = true;
    const d: IDimensions = { width: w, height: h };
    let r1 = 1;
    // const descObj = this.os.getCache('localStorage', 'desc', 'object')[0];
    // const arrDesc = [];
    // Object.keys(descObj).forEach(key => {
    //     arrDesc.push(descObj[key]);
    // });
    // const faceDescriptorCache = [Float32Array.from(arrDesc, z => z)];
    // https://itnext.io/face-api-js-javascript-api-for-face-recognition-in-the-browser-with-tensorflow-js-bcc2a6c4cf07
    // // For all faces
    // const fullFaceDescriptions = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();
    // if (typeof fullFaceDescriptions !== 'undefined') {
    //     fullFaceDescriptions.forEach(x => {
    //         faceapi.draw.drawDetections(canvas, x);
    //         faceapi.draw.drawFaceLandmarks(canvas, x);
    //     });
    // }
    // For single face
    try {
      let fullFaceDescriptionLast = await faceapi.detectSingleFace(canvaslast).withFaceLandmarks().withFaceDescriptor();
      fullFaceDescriptionLast = faceapi.resizeResults(fullFaceDescriptionLast, d);
      let fullFaceDescriptionPrior = await faceapi.detectSingleFace(canvasprior).withFaceLandmarks().withFaceDescriptor();
      fullFaceDescriptionPrior = faceapi.resizeResults(fullFaceDescriptionPrior, d);
      if (typeof fullFaceDescriptionLast !== 'undefined') {
        faceapi.draw.drawDetections(canvaslast, fullFaceDescriptionLast);
        faceapi.draw.drawFaceLandmarks(canvaslast, fullFaceDescriptionLast);
      }
      if (typeof fullFaceDescriptionPrior !== 'undefined') {
        faceapi.draw.drawDetections(canvasprior, fullFaceDescriptionPrior);
        faceapi.draw.drawFaceLandmarks(canvasprior, fullFaceDescriptionPrior);
      }
      const faceDescriptorLast = [fullFaceDescriptionLast.descriptor];
      console.log(faceDescriptorLast);
      const faceDescriptorPrior = [fullFaceDescriptionPrior.descriptor];
      console.log(faceDescriptorPrior);
      // // // const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(name, faceDescriptor);
      const labeledFaceDescriptorsPrior = new faceapi.LabeledFaceDescriptors('Prior', faceDescriptorPrior);
      // 0.6 is a good distance threshold value to judge
      // whether the descriptors match or not
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptorsPrior, this.maxDescriptorDistance);
      const results = [fullFaceDescriptionLast].map(fd => faceMatcher.findBestMatch(fd.descriptor));
      // tslint:disable-next-line: no-string-literal
      r1 = results[0]['_distance'];
    } catch (e) {
      console.log(e);
    }
    finally {
      // return r1;
      console.log('done');
    }
    return r1;
  }
  openDialog(messageStr: string) {
    const dialogRef = this.dialog.open(OverlayMessageComponent, {
      data: {
        message: messageStr,
        buttonText: {
          ok: 'Save',
          cancel: 'No'
        }
      }
    });
    // const snack = this.snackBar.open('Snack bar open before dialog');
    dialogRef.afterClosed().subscribe((confirmed: any) => {
      console.log(confirmed);
      // if (confirmed) {
      //     // snack.dismiss();
      //     // const a = document.createElement('a');
      //     // a.click();
      //     // a.remove();
      //     // snack.dismiss();
      //     // this.snackBar.open('Closing snack bar in a few seconds', 'Fechar', {
      //     //     duration: 2,
      //     // });
      // }
    });
  }
  onFileCompleteFirst(data: any) {
    const img = new Image();
    img.src = data.result;
    img.onload = () => {
      let imgWidth = img.naturalWidth;
      const screenWidth = this.canvasLast.nativeElement.width;
      let scaleX = 1;
      if (imgWidth > screenWidth) {
        scaleX = screenWidth / imgWidth;
      }
      let imgHeight = img.naturalHeight;
      const screenHeight = this.canvasLast.nativeElement.height;
      let scaleY = 1;
      if (imgHeight > screenHeight) {
        scaleY = screenHeight / imgHeight;
      }
      let scale = scaleY;
      if (scaleX < scaleY) {
        scale = scaleX;
      }
      if (scale < 1) {
        imgHeight = imgHeight * scale;
        imgWidth = imgWidth * scale;
      }
      this.canvasLast.nativeElement.height = imgHeight;
      this.canvasLast.nativeElement.width = imgWidth;
      this.clearFirst();
      this.canvasLast.nativeElement.getContext('2d').
        drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, imgWidth, imgHeight);
      // this.canvasLast.nativeElement.getContext('2d').drawImage(img, 0, 0, 100, 100 *
      //     this.canvasLast.nativeElement.height / this.canvasLast.nativeElement.width);
    };
  }
  onFileCompleteSecond(data: any) {
    const img = new Image();
    img.src = data.result;
    img.onload = () => {
      let imgWidth = img.naturalWidth;
      const screenWidth = this.canvasPrior.nativeElement.width;
      let scaleX = 1;
      if (imgWidth > screenWidth) {
        scaleX = screenWidth / imgWidth;
      }
      let imgHeight = img.naturalHeight;
      const screenHeight = this.canvasPrior.nativeElement.height;
      let scaleY = 1;
      if (imgHeight > screenHeight) {
        scaleY = screenHeight / imgHeight;
      }
      let scale = scaleY;
      if (scaleX < scaleY) {
        scale = scaleX;
      }
      if (scale < 1) {
        imgHeight = imgHeight * scale;
        imgWidth = imgWidth * scale;
      }
      this.canvasPrior.nativeElement.height = imgHeight;
      this.canvasPrior.nativeElement.width = imgWidth;
      this.clearSecond();
      this.canvasPrior.nativeElement.getContext('2d').
        drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, imgWidth, imgHeight);
    };
  }
  clearFirst() {
    const context = this.canvasLast.nativeElement.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.restore();
  }
  clearSecond() {
    const context = this.canvasPrior.nativeElement.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.restore();
  }
  ngAfterViewInit() {
    console.log(this.c1);
  }
}
