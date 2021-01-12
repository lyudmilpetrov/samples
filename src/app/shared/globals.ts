import { Injectable } from '@angular/core';
// import { IOption } from 'ng-select';

@Injectable({ providedIn: 'root' })
export class GlobalStaticVariables {
  public env: object = {
    api: {
      test: 'http://localhost:44361/',
      test_latest: 'http://localhost:54123/',
      dev: 'http://servername/',
      pro: 'http://servername/',
      api: ''
    },
    excelfilesave: {
      test: 'C:\\Users\\username\\source\\repos\\riskapiservices\\excel\\',
      test_latest: 'C:\\Users\\username\\source\\repos\\riskapiservices_v_2\\riskapiservices_v_2\\excel\\',
      dev: '\\\\servername\\RiskFinance\\excel\\',
      pro: '\\\\servername\\RiskFinance\\excel\\',
      excelfilesave: ''
    },
    excelfiledownload: {
      test: 'http://localhost:44361/excel/',
      test_latest: 'http://localhost:54123/excel/',
      dev: 'http://servername/excel/',
      pro: 'http://servername/excel/',
      excelfilesave: ''
    },
    wccaseprecreatedexcelfiledownload: {
      test: 'http://localhost:44361/wc/files/',
      test_latest: 'http://localhost:54123/wc/files/',
      dev: 'http://servername/wc/files/',
      pro: 'http://servername/wc/files/',
      excelfilesave: ''
    },
    image: {
      test: 'assets/images/',
      test_latest: 'assets/images/',
      dev: 'assets/images/',
      pro: 'assets/images/',
      image: ''
    },
    map: {
      test: '../assets/',
      test_latest: '../assets/',
      dev: 'http://servername/excel/',
      pro: 'http://servername/excel/',
      map: ''
    },
    shortnames: {
      imagelogo: 'trinet_wingmark.png',
      imageearthspin: 'earth0.gif',
      imageearthstop: 'earth0.png'
    },
    messages: {
      nothingfound: 'No records found. Please try again.',
      serverissue: 'Unexpected issue encountered, please try again.',
      projectidnotright: 'Please enter proper Project ID number!',
      filladdressinfo: 'Address Number and Street can NOT be blank',
      fillapnnamestreet: 'Please enter one of: APN, Common Name or Street',
      noresultstoapply: 'There is nothing to be applied!',
      projectmodeedit: 'The project needs to be in Edit mode!',
      projectmodeadd: 'The project needs to be in Add mode!',
      buildingaccess: 'You do not have proper rights to edit Building Processes!',
      landaccess: 'You do not have proper rights to edit Land Processes!',
      plancheckregistring: 'You can not add plan check without first registering Plan for the given project!',
      mandatoryfields: 'Please fill in mandatory fields.',
      assessorfilesnotproper: `Please try again the files need to be texual (.txt)
             and to contain in their names the words DDS and CHR!`,
      assessorfilesissue: `There was an issue with loading the files, please contact IT support!`,
      buildinginspectionmissingid: `Project REPLACE is missing an Issue Date and you will not be able to add Inspection`,
      passwordnotmatched: 'Please make sure that passwords are matching!'
    },
    pk: { k: 'Kole=!6G792%Vd5=' }
  };
  get(keylevel0: string, keylevel1: string) {
    const r = this.env[keylevel0][keylevel1];
    return r;
  }
  set(keylevel0: string, keylevel1: string, value: string) {
    this.env[keylevel0][keylevel1] = value;
  }
}
@Injectable()
export class Globals {
  counterNumberForSignalR = 1;
  incrementQuestionNumber() {
    // // console.log(this.counterNumberForSignalR);
    return ++this.counterNumberForSignalR;
  }
}
export interface UserInfo {
  id: string;
  fullname: string;
  name: string;
  pass: string;
  division: string;
  pmrights: string;
  brights: string;
  crights: string;
  lrights: string;
  parights: string;
  adm: string;
  internet: string;
  apipoint: string;
  signalrapipoint: string;
  connectionname: string;
  connectionnameland: string;
  connectionnamestaff: string;
  n: string;
  signalrconnectionid: string;
}
export interface FilesJsonInfo {
  FileName: string;
  Json: string;
  JsonCount: number;
  API: string;
  PBK: string;
  Connection: string;
  UserName: string;
  UserMachine: string;
  SignalRConnectionID: string;
  SignalRAPIPoint: string;
  SignalRChannel: string;
  SignalREventName: string;
}
export interface PDFWordLength {
  word: string;
  length: number;
}
export interface PDFTextDimmensions {
  w: number;
  h: number;
}
