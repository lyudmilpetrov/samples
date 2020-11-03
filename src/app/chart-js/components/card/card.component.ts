import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboards-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges {
  @Input() title: string;
  titlestr: string[] = [];
  constructor() { }
  ngOnChanges() {
    this.titlestr = this.title.split(',');
    console.log(this.titlestr);
  }
  ngOnInit(): void {
    this.titlestr = this.title.split(',');
    console.log(this.titlestr);
  }

  captureScreen() {
    const data = document.getElementById('contentToConvert' + this.titlestr[1]);
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      // const imgWidth = 208;
      // const pageHeight = 295;
      // const imgHeight = canvas.height * imgWidth / canvas.width;
      // const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      // portrait
      // const doc: any = new jsPDF('p', 'mm', 'a4');
      // landscape
      const doc: any = new jsPDF('l', 'mm', 'a4');
      const width = doc.internal.pageSize.width;
      const height = doc.internal.pageSize.height;
      const position = 0;
      // doc.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      doc.addImage(contentDataURL, 'PNG', 0, position, width, height);
      doc.save(this.titlestr[0] + '.pdf'); // Generated PDF
    });
  }

}
