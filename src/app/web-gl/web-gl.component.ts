import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OverlayMessageComponent } from '@app/components/overlay-message/overlay-message.component';
import * as faceapi from 'face-api.js';
import { OfflineService } from '../services/services';
import * as THREE from 'three';
@Component({
    templateUrl: './web-gl.html',
    styleUrls: ['./web-gl.css'],
    // // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WebGLComponent implements OnInit, AfterViewInit {
    // @ViewChild('webgl1') barchartCanvas: ElementRef<HTMLCanvasElement>;
    // public context1: CanvasRenderingContext2D;
    breakpoint: number;

    constructor() {
        // console.log('loaded');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
        // this.context1 = this.barchartCanvas.nativeElement.getContext('2d');
        // this.barchartCanvas.nativeElement.appendChild(renderer.domElement);
        // // console.log(document.body);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;


        const animate = () => {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();

    }
    ngOnInit() {
    }
    ngAfterViewInit(): void {
        // console.log('loaded');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
        const container = document.getElementById('canvas');
        container.appendChild(renderer.domElement);
        // this.context1 = this.barchartCanvas.nativeElement.getContext('2d');
        // this.barchartCanvas.nativeElement.appendChild(renderer.domElement);
        // console.log(renderer.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;


        const animate = () => {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();
    }
    onResize(event) {
        this.breakpoint = (event.target.innerWidth <= 4) ? 1 : 2;
    }
}
