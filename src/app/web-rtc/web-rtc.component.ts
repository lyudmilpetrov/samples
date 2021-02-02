// <!-- Video Source -->
// <!-- https://www.pexels.com/video/aerial-view-of-beautiful-resort-2169880/ -->
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { GenericServices } from '@app/services/services';
@Component({
  templateUrl: './web-rtc.html',
  styleUrls: ['./web-rtc.css'],
  // // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebRTCComponent implements OnInit, AfterViewInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('c1', { static: true }) c1: MatCard;
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
  videoWidth = 0;
  videoHeight = 0;
  breakpoint: number;
  screenWidth: any;
  screenHeight: any;
  constructor(
    private gs: GenericServices,
    private renderer: Renderer2
  ) { }
  ngOnInit() {
    if (this.gs.checkIfMobile()) {
      this.constraints.video.facingMode = 'user';
    }
    this.startCamera();

  }
  ngAfterViewInit() {
    // const menuToggle = document.querySelector('.toggle');
    // const showcase = document.querySelector('.showcase');
    // menuToggle.addEventListener('click', () => {
    //   menuToggle.classList.toggle('active');
    //   showcase.classList.toggle('active');
    // });
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
    console.log(this.videoHeight);
  }
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Camera not available.');
    }
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 4) ? 1 : 2;
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
}
