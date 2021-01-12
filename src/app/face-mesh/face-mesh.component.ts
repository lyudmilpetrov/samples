import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, Renderer2, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OverlayMessageComponent } from '@app/components/overlay-message/overlay-message.component';
import * as faceapi from 'face-api.js';
import { OfflineService } from '../services/services';

@Component({
    templateUrl: './face-mesh.html',
    styleUrls: ['./face-mesh.css'],
    // // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaceMeshComponent implements OnInit {
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
    faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');
    @ViewChild('video', { static: true }) videoElement: ElementRef;
    @ViewChild('canvasLast', { static: true }) canvasLast: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasPrior', { static: true }) canvasPrior: ElementRef<HTMLCanvasElement>;
    constructor(
        private renderer: Renderer2,
        private os: OfflineService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private httpClient: HttpClient,
        private ngZone: NgZone) {
        require('@tensorflow/tfjs-backend-webgl');

    }
    ngOnInit() {
        // console.log(this.faceLandmarksDetection);
        // this.main();
        this.startCamera();
    }
    attachVideo(stream) {
        this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
        this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
            this.main();
        });
    }
    handleError(error) {
        // console.log('Error: ', error);
    }
    startCamera() {
        if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
        } else {
            alert('Camera not available.');
        }
    }
    async main() {
        // Load the MediaPipe Facemesh package.
        const model = await this.faceLandmarksDetection.load(
            this.faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);

        // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain an
        // array of detected faces from the MediaPipe graph. If passing in a video
        // stream, a single prediction per frame will be returned.
        const predictions = await model.estimateFaces({
            input: document.querySelector('video')
        });
        // console.log(predictions);
        if (predictions.length > 0) {
            /*
            `predictions` is an array of objects describing each detected face, for example:

            [
              {
                faceInViewConfidence: 1, // The probability of a face being present.
                boundingBox: { // The bounding box surrounding the face.
                  topLeft: [232.28, 145.26],
                  bottomRight: [449.75, 308.36],
                },
                mesh: [ // The 3D coordinates of each facial landmark.
                  [92.07, 119.49, -17.54],
                  [91.97, 102.52, -30.54],
                  ...
                ],
                scaledMesh: [ // The 3D coordinates of each facial landmark, normalized.
                  [322.32, 297.58, -17.54],
                  [322.18, 263.95, -30.54]
                ],
                annotations: { // Semantic groupings of the `scaledMesh` coordinates.
                  silhouette: [
                    [326.19, 124.72, -3.82],
                    [351.06, 126.30, -3.00],
                    ...
                  ],
                  ...
                }
              }
            ]
            */

            // tslint:disable-next-line: prefer-for-of
            // for (let i = 0; i < predictions.length; i++) {
            //     const keypoints = predictions[i].scaledMesh;

            //     // Log facial keypoints.
            //     for (let i = 0; i < keypoints.length; i++) {
            //         const [x, y, z] = keypoints[i];

            //         // // console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
            //     }
            // }
        }
    }
}
