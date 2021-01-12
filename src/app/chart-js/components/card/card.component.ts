import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatCard } from '@angular/material/card';
import { ApiServices, DataServices, GenericServices } from '@app/services/services';
import { GlobalStaticVariables } from '@app/shared/globals';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-dashboards-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('cardEl') card: MatCard;
  @Input() title: string;
  @Input() data: string;
  data2: any[] = [];
  titlestr: string[];
  constructor(private api: ApiServices, private gsv: GlobalStaticVariables, private ds: DataServices, private gs: GenericServices) { }
  ngOnChanges() {
    this.titlestr = this.title.split(',');
    // // // console.log(this.data);
    if (typeof (this.data) !== 'undefined') {
      if (this.data.length > 0) {
        this.data2 = JSON.parse(this.data);
        // // console.log(this.data2);
      }
    }
  }
  ngOnInit(): void {
    this.titlestr = this.title.split(',');
    // this.data2 = this.data;
    // // // // console.log(this.titlestr);
    // // console.log(this.data2);
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
  getExcel(data: any[]) {
    // this.gsv.set('api', 'signalrapi', 'https://localhost:44382/');
    // // // console.log(this.gsv.get('api', 'signalrapi'));
    const filename = 'C:\\Users\\ljudm\\source\\repos\\samples\\Files\\1.txt';
    const env = 'https://localhost:44382/Files/';
    const url = 'https://localhost:44382/Files/1.xlsx';
    const name = '1.csv';
    // this.gs.downloadFilesObservable([filename], env, ['xlsx', 'csv', 'txt']).subscribe(res => { }, err => { });
    // this.gs.getAnyFilefromServerURL(env, name);
    // this.ds.download(url);
    // this.gs.downloadFileObservable(url, name).subscribe(res => { }, err => { });
    // this.gs.download();
    // this.http.get(path`, {responseType: 'blob'}).subscribe(file=> { const url:string = URL.createObjectURL(file); const link = document.createElement("a"); link.setAttribute("href", url); link.setAttribute("download", "Template.xlsx"); link.style.display = "none"; document.body.appendChild(link); link.click(); document.body.removeChild(link); });
    // works
    // this.api.getExcel2(this.gsv.get('api', 'signalrapi')).subscribe(x => {
    //   const EXCEL_EXTENSION = '.xlsx';
    //   // // // console.log(x);
    //   const dataType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //   const binaryData = [];
    //   binaryData.push(x);
    //   const data: Blob = new Blob(binaryData, { type: dataType });
    //   // const downloadLink = document.createElement('a');
    //   // downloadLink.href = window.URL.createObjectURL(data);
    //   // document.body.appendChild(downloadLink);
    //   // downloadLink.dispatchEvent(new MouseEvent('click'));
    //   FileSaver.saveAs(data, 'test_export_' + new Date().getTime() + EXCEL_EXTENSION);
    //   // downloadLink.parentNode.removeChild(downloadLink);
    //   // saveAs(x._body, 'test.xlsx');
    //   // window.open(x);
    //   // // Fetch the original image
    //   // fetch('./1.xlsx')
    //   //   // Retrieve its body as ReadableStream
    //   //   .then(response => response.body);

    // });
    // // console.log(this.data2);
    const sheetname = this.titlestr[0].slice(-10).replace(/\//g, '_');
    const excelname = 'Cases_as_of_' + sheetname;
    console.log(this.data2);
    this.exportAsExcelFile(this.data2, excelname, sheetname);
  }
  ngAfterViewInit() {
    // // // console.log(this.card._animationMode);
  }
  exportAsExcelFile(json: any[], excelFileName: string, sheetName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log(worksheet);
    // tslint:disable-next-line: one-variable-per-declaration
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    // workbook.SheetNames[0] = sheetName;
    console.log(workbook);
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
