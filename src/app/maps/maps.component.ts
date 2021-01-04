import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Renderer2, NgZone, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OverlayMessageComponent } from '@app/components/overlay-message/overlay-message.component';
import { LoginFormComponent } from '@app/components/login-form/login-form.component';
import * as faceapi from 'face-api.js';
import { OfflineService } from '../services/services';
import { ToastrService } from '@app/services/toastr.service';
import { restrictedWords } from '@app/services/restrictedWordsValidators';
// https://timdeschryver.dev/blog/google-maps-as-an-angular-component
// https://nominatim.openstreetmap.org/
// https://www.codexworld.com/google-maps-image-using-google-static-maps-api/
import html2canvas from 'html2canvas';

@Component({
  templateUrl: './maps.html',
  styleUrls: ['./maps.css'],
  // // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsComponent implements OnInit, AfterViewInit {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  zoom = 12;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };
  mapProp = {
    center: new google.maps.LatLng(18.5793, 73.8143),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  constructor(
    private toastr: ToastrService,
    private renderer: Renderer2,
    private os: OfflineService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private ngZone: NgZone) {


  }
  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }
  ngAfterViewInit() {
    this.map = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);
    console.log(this.map);
    console.log(this.gmapElement);
    html2canvas(document.querySelector('#capture')).then(canvas => {
      // tslint:disable-next-line: max-line-length
      const imgData = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');  // here is the most important part because if you dont replace you will get a DOM 18 exception.
      window.location.href= imgData; // it will save locally
      console.log(imgData);
      document.body.appendChild(canvas);
  });
  }
  zoomIn() {
    if (this.zoom < this.options.maxZoom) { this.zoom++; }
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) { this.zoom--; }
  }
}
