import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, Renderer2, NgZone, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OverlayMessageComponent } from '@app/components/overlay-message/overlay-message.component';
import { LoginFormComponent } from '@app/components/login-form/login-form.component';
import * as faceapi from 'face-api.js';
import { OfflineService } from '../services/services';
import { restrictedWords } from '@app/services/restrictedWordsValidators';
// import { ToastrService } from '@app/services/toastr.service';
import { TOASTR_TOKEN, Toastr } from '@app/services/toastr.service';
import { inject } from '@angular/core/testing';

// import { WebWorker } from './web_worker';
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
  templateUrl: './face-login.html',
  styleUrls: ['./face-login.css'],
  // // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaceLoginComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvasLast', { static: true }) canvasLast: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasPrior', { static: true }) canvasPrior: ElementRef<HTMLCanvasElement>;
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
  username = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z].*')]);
  password = new FormControl('', [Validators.required, restrictedWords(['test', 'bar'])]);
  profileForm: FormGroup = new FormGroup({
    username: this.username,
    password: this.password
  });
  hideLoginForm = false;
  hidePassword = true;
  panelOpenState = false;
  currentUserName = '';
  constructor(
    @Inject(TOASTR_TOKEN) private toastr: Toastr,
    // private toastr: ToastrService,
    private renderer: Renderer2,
    private os: OfflineService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private ngZone: NgZone) {

    // const data = require('src/file.json');
    // console.log("Json data : ", JSON.stringify(data));
    // console.log('! 1 ');
    // console.log(this.MODEL_URL);
    // if (window.location.href !== 'http://localhost:4200/face-recognition') {
    //     // this.MODEL_URL = window.location.href.replace('face-recognition', '') + 'assets/weights';
    //     this.MODEL_URL = 'assets/weights';
    //     console.log('! 2');
    //     console.log(this.MODEL_URL);
    // } else {
    //     this.MODEL_URL = window.location.href + this.MODEL_URL;
    // }
    // console.log('! 3');
    // console.log(this.MODEL_URL);
    // this.loadF(this.MODEL_URL, 'loadSsdMobilenetv1Model');
    // this.httpClient.get(this.MODEL_URL + '/ssd_mobilenetv1_model-weights_manifest.json').subscribe(d => {
    //     console.log(d[0].weights);
    //     // const float32 = new Float32Array();
    //     // let i = 0;
    //     // const x = d[0].weights.map(y => {
    //     //     console.log(y);
    //     //     float32[i] = y;
    //     //     i++;
    //     // });
    //     // console.log(float32);
    //     // console.log(Float32Array.of(d[0].weights));
    //     faceapi.nets.ssdMobilenetv1.load(this.MODEL_URL);
    // });
    // this.httpClient.get(this.MODEL_URL + '/face_landmark_68_model-weights_manifest.json').subscribe(d => {
    //     console.log(d);
    //     faceapi.nets.faceLandmark68Net.loadFromUri(this.MODEL_URL);
    // });
    // this.httpClient.get(this.MODEL_URL + '/face_landmark_68_model-weights_manifest.json').subscribe(d => {
    //     console.log(d);
    //     faceapi.nets.faceRecognitionNet.loadFromUri(this.MODEL_URL);
    // });
    // // faceapi.loadSsdMobilenetv1Model(this.MODEL_URL).then((x1) => {
    // //     console.log(x1);
    // //     faceapi.loadFaceDetectionModel(this.MODEL_URL).then((x2) => {
    // //         console.log(x2);
    // //         faceapi.loadFaceLandmarkModel(this.MODEL_URL).then((x3) => {
    // //             console.log(x3);
    // //             faceapi.loadFaceRecognitionModel(this.MODEL_URL);
    // //         });
    // //     });
    // // });

    // faceapi.loadFaceLandmarkModel(this.MODEL_URL);
    // faceapi.loadFaceRecognitionModel(this.MODEL_URL);
    // const json = require(this.MODEL_URL + '/face_recognition_model-weights_manifest.json');
    // console.log(json);
    // Promise.all([
    //   this.loadF(this.MODEL_URL, 'loadSsdMobilenetv1Model')
    //     .then(x => {
    //       console.log(x);
    //     })
    //     .catch(err => { console.log(err); })
    //     .finally(() => { console.log('done'); }),
    //   this.loadF(this.MODEL_URL, 'loadFaceDetectionModel').then(x => {
    //     console.log(x);
    //   })
    //     .catch(err => { console.log(err); })
    //     .finally(() => { console.log('done'); }),
    //   this.loadF(this.MODEL_URL, 'loadFaceLandmarkModel').then(x => {
    //     console.log(x);
    //   })
    //     .catch(err => { console.log(err); })
    //     .finally(() => { console.log('done'); }),
    //   this.loadF(this.MODEL_URL, 'loadFaceRecognitionModel').then(x => {
    //     console.log(x);
    //   })
    //     .catch(err => { console.log(err); })
    //     .finally(() => { console.log('done'); })
    // ]).then((values) => {
    //   console.log(values);
    // }).catch(err => console.log(err)).finally(() => {
    //   console.log('done loading');
    //   console.log(faceapi);
    // });
  }
  ngOnInit() {
    // this.toastr.setTopCentered();
    this.toastr.options.positionClass = 'toast-top-center';
    this.toastr.success('open now', 'title');
    console.log(faceapi);
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 2;
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
    // this.openDialog();
    // this.startCamera();
    // this.openLoginForm('now');


  }
  errorHandling = (control: string, error: string) => {
    return this.profileForm.controls[control].hasError(error);
  }
  loginWithPassword(formvalues) {
    console.log(formvalues);
    if (this.profileForm.valid) {
      if (formvalues.username.replace(/ +/g, ' ').length >= 1 && formvalues.password.replace(/ +/g, ' ').length) {
        const obj = {
          username: formvalues.username,
          password: formvalues.password
        };
        this.currentUserName = formvalues.username;
        this.os.setCache('localStorage', formvalues.username.replace(/ +/g, ' '), obj, 'object');
        this.hideLoginForm = true;
      }
    } else {

    }
  }
  loginWithFace(formvalues) {
    console.log(formvalues);
  }
  openLoginForm(messageStr: string) {
    const dialogRef = this.dialog.open(LoginFormComponent, {
      width: '60vw',
      maxWidth: '60vw',
      height: '60vh',
      maxHeight: '60vh',
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
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 4) ? 1 : 2;
  }
  async loadF(url: string, call: string) {
    await faceapi[call](url);
  }
  handleError(error) {
    console.log('Error: ', error);
  }
  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Camera not available.');
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
    // setTimeout(() => {
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

    // }, 200);
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
  onFileComplete(data: any) {
    console.log(data);
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
      this.canvasLast.nativeElement.getContext('2d').
        drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, imgWidth, imgHeight);
      // this.canvasLast.nativeElement.getContext('2d').drawImage(img, 0, 0, 100, 100 *
      //     this.canvasLast.nativeElement.height / this.canvasLast.nativeElement.width);
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

}
