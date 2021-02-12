import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MatCard } from '@angular/material/card';
import { ApiServices, DataServices, GenericServices } from '@app/services/services';
import { GlobalStaticVariables } from '@app/shared/globals';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
declare var JSPM: any;
@Component({
  selector: 'app-dashboards-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('cardEl') card: ElementRef;
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
    // console.log(JSPM);
    // console.log(this.card);
    // JSPM.JSPrintManager.license_url = 'https://neodynamic.com/licenses/jspm/v3/demo';
    // JSPM.JSPrintManager.auto_reconnect = true;
    // JSPM.JSPrintManager.start();
    // JSPM.JSPrintManager.WS.onStatusChanged = () => {
    //   if (this.jspmWSStatus()) {
    //     // get client installed printers
    //     JSPM.JSPrintManager.getPrinters().then((myPrinters: string[]) => {
    //       // this.printers = myPrinters;
    //       console.log(myPrinters);
    //       // this.doPrintPDF();
    //     });
    //   }
    // };
    // let spawn = require('child_process').spawn;
    // spawn('powershell.exe', ['.\download-packages-license.ps1']);
    // this.titlestr = this.title.split(',');
    // Create the PS Instance
    // let ps = new powershell({
    //   executionPolicy: 'Bypass',
    //   noProfile: true
    // });

    // // Load the gun
    // ps.addCommand(`Roads? Where we're going, we don't need roads.`)

    // // Pull the Trigger
    // ps.invoke()
    //   .then(output => {
    //     console.log(output);
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     ps.dispose();
    //   });
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
    console.log(this.card.nativeElement);
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
  silentPrinting() {

  }
  jspmWSStatus() {
    if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) {
      return true;
    } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Closed) {
      alert('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm');
      return false;
    } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Blocked) {
      alert('JSPM has blocked this website!');
      return false;
    }
  }
  doPrintZPL() {
    // // console.log(this.selectedPrinter);
    // // if (this.selectedPrinter !== 'undefined' && this.jspmWSStatus()) {
    // // Create a ClientPrintJob
    // const cpj = new JSPM.ClientPrintJob();
    // // // Set Printer type (Refer to the help, there many of them!)
    // // //https://www.neodynamic.com/Products/Help/JSPrintManager2.0/articles/jsprintmanager.html#client-printer-types
    // // if (this.isDefaultPrinterSelected) {
    // //   cpj.clientPrinter = new JSPM.DefaultPrinter();
    // // } else {
    // cpj.clientPrinter = new JSPM.InstalledPrinter('Brother DCP-1610W series Printer');
    // // }

    // // Set content to print...
    // // Create Zebra ZPL commands for sample label
    // let cmds = '^XA';
    // cmds += '^FO20,30^GB750,1100,4^FS';
    // cmds += '^FO20,30^GB750,200,4^FS';
    // cmds += '^FO20,30^GB750,400,4^FS';
    // cmds += '^FO20,30^GB750,700,4^FS';
    // cmds += '^FO20,226^GB325,204,4^FS';
    // cmds += '^FO30,40^ADN,36,20^FDShip to:^FS';
    // cmds += '^FO30,260^ADN,18,10^FDPart number #^FS';
    // cmds += '^FO360,260^ADN,18,10^FDDescription:^FS';
    // cmds += '^FO30,750^ADN,36,20^FDFrom:^FS';
    // cmds += '^FO150,125^ADN,36,20^FDAcme Printing^FS';
    // cmds += '^FO60,330^ADN,36,20^FD14042^FS';
    // cmds += '^FO400,330^ADN,36,20^FDScrew^FS';
    // cmds += '^FO70,480^BY4^B3N,,200^FD12345678^FS';
    // cmds += '^FO150,800^ADN,36,20^FDMacks Fabricating^FS';
    // cmds += '^XZ';
    // cpj.printerCommands = cmds;

    // console.log(cmds);
    // // Send print job to printer!
    // cpj.sendToClient();
    // // }
  }
  doPrintPDF() {
    // console.log(this.selectedPrinter);
    // if (this.selectedPrinter !== 'undefined' && this.jspmWSStatus()) {
    // Create a ClientPrintJob
    const cpj = new JSPM.ClientPrintJob();
    // Set Printer type (Refer to the help, there many of them!)
    // if ( this.isDefaultPrinterSelected ) {
    //       cpj.clientPrinter = new JSPM.DefaultPrinter();
    //     } else {
    cpj.clientPrinter = new JSPM.InstalledPrinter('Brother DCP-1610W series Printer');
    // }

    // Set content to print...
    // Set PDF file... for more advanced PDF settings please refer to
    // https://www.neodynamic.com/Products/Help/JSPrintManager2.0/apiref/classes/jspm.printfilepdf.html
    let my_file = new JSPM.PrintFilePDF('https://neodynamic.com/temp/LoremIpsum.pdf', JSPM.FileSourceType.URL, 'MyFile.pdf', 1);
    //  my_file.printRotation = JSPM.PrintRotation[$('#lstPrintRotation').val()];
    //  my_file.printRange = $('#txtPagesRange').val();
    //  my_file.printAnnotations = $('#chkPrintAnnotations').prop('checked');
    //  my_file.printAsGrayscale = $('#chkPrintAsGrayscale').prop('checked');
    //  my_file.printInReverseOrder = $('#chkPrintInReverseOrder').prop('checked');
    //Set Printer info
    // cpj.clientPrinter.paperName = '';
    // cpj.clientPrinter.paperName = '';
    //  //Set PDF file

    cpj.files.push(my_file);

    // Send print job to printer!
    // cpj.sendToClient();
  }
}
