// <!-- Video Source -->
// <!-- https://www.pexels.com/video/aerial-view-of-beautiful-resort-2169880/ -->
import { Component, OnInit, AfterViewInit } from '@angular/core';
@Component({
  templateUrl: './landing-video.html',
  styleUrls: ['./landing-video.css'],
  // // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingVideoComponent implements OnInit, AfterViewInit {

  constructor(
  ) { }
  ngOnInit() {

  }
  ngAfterViewInit() {
    const menuToggle = document.querySelector('.toggle');
    const showcase = document.querySelector('.showcase');
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      showcase.classList.toggle('active');
    });
  }
}
