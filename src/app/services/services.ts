
import { throwError as observableThrowError, Observable, from, BehaviorSubject, Subject, Subscription, AsyncSubject, Observer } from 'rxjs';
import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UserInfo } from '../shared/globals';
import { map, filter, scan, catchError, mergeMap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// import { truncate } from 'fs';
// import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Injectable({ providedIn: 'root' })
export class OfflineService {
  private offlineSource = new AsyncSubject();
  offline$ = this.offlineSource.asObservable();
  constructor() {
    try {
      window.addEventListener('online', (event) => this.onChange(event.type));
      window.addEventListener('offline', (event) => this.onChange(event.type));
    } catch (e) {
      // // // // // // // // // // // // // // // // // // // // // // e);
    }
  }
  onChange(internetconnection: string) {
    return internetconnection;
  }
  setCache = (storagetype: string, storagename: string, value: any, valuetype: string) => {
    const t = valuetype.toLowerCase().trim();
    if (storagetype === 'sessionStorage' || storagetype === 'localStorage') {
      if (typeof (window[storagetype]) !== 'undefined') {
        // reseting forcefuly
        if (typeof (window[storagetype][storagename]) !== 'undefined') {
          window[storagetype].removeItem(storagename);
        }
        if (t === 'object' || t === 'array') {
          window[storagetype].setItem(storagename, JSON.stringify(value));
        } else {
          window[storagetype].setItem(storagename, value);
        }
      } else {
        return false;
      }
    }
  }
  getCache = (storagetype: string, storagename: string, valuetype: string) => {
    const t = valuetype.toLowerCase().trim();
    if (typeof (window[storagetype][storagename]) !== 'undefined') {
      if (t === 'object' || t === 'array') {
        return JSON.parse(window[storagetype][storagename]);
      } else {
        return window[storagetype][storagename];
      }
    } else {
      return false;
    }
  }
  clearCache = (storagetype: string, storagename: string) => {
    if (storagetype === 'sessionStorage' || storagetype === 'localStorage') {
      if (typeof (window[storagetype]) !== 'undefined') {
        // reseting forcefuly
        if (typeof (window[storagetype][storagename]) !== 'undefined') {
          window[storagetype].removeItem(storagename);
        }
      } else {
        return false;
      }
    }
  }
  clearBuildingSessionObjects() {
    const erasememory = [
      'buildingplans', 'buildingplanschosen', 'buildingplanslist',
      'buildingplancheck', 'buildingplancheckchosen', 'buildingplanchecklist'
    ];
    const t = this;
    erasememory.forEach((e) => {
      t.clearCache('sessionStorage', e);
    });
  }
}
@Injectable({ providedIn: 'root' })
export class DataServices {
  user: UserInfo = {
    id: '',
    fullname: '',
    name: '',
    pass: '',
    division: '',
    pmrights: '',
    brights: '',
    crights: '',
    lrights: '',
    parights: '',
    adm: '',
    internet: '',
    apipoint: '',
    signalrapipoint: '',
    connectionname: '',
    connectionnameland: '',
    connectionnamestaff: '',
    n: '',
    signalrconnectionid: ''
  };
  emptyuser: UserInfo = {
    id: '',
    fullname: '',
    name: '',
    pass: '',
    division: '',
    pmrights: '',
    brights: '',
    crights: '',
    lrights: '',
    parights: '',
    adm: '',
    internet: '',
    apipoint: '',
    signalrapipoint: '',
    connectionname: '',
    connectionnameland: '',
    connectionnamestaff: '',
    n: '',
    signalrconnectionid: ''
  };
  private userInit = new BehaviorSubject<UserInfo>(this.user);
  currentUser = this.userInit.asObservable();
  constructor(@Optional() @SkipSelf() parentModule: DataServices, private os: OfflineService
  ) {
    // if (parentModule) {
    //     throw new Error(
    //         'CoreModule is already loaded. Import it in the AppModule only');
    // }
  }
  changeCurrentUser(user: UserInfo) {
    this.user = user;
    this.userInit.next(user);
  }
  eraseUser() {
    this.user = this.emptyuser;
    this.userInit.next(this.user);
  }
  getCurrentUser() {
    return this.user;
  }
  downloadFilesObservable = (fullpaths: string[], env: string, filesExtensions: string[]): Observable<any> => {
    return new Observable((observer: any) => {
      observer.next(
        ((f, e) => {
          function download_next(i) {
            if (i >= f.length) {
              return 'done';
            } else {
              const filename = f[i].slice(f[i].lastIndexOf('\\') + 1);
              const fileExtension = filename.slice(filename.lastIndexOf('.') + 1);
              const filenamefullpath = e + filename;
              if (filesExtensions.includes(fileExtension)) {
                const a = document.createElement('a');
                a.href = filenamefullpath;
                a.target = '_parent';
                // Use a.download if available, it prevents plugins from opening.
                if ('download' in a) {
                  a.download = filename;
                }
                // Add a to the doc for click to work.
                (document.body || document.documentElement).appendChild(a);
                if (a.click) {
                  a.click(); // The click method is supported by most browsers.
                }
                // Delete the temporary link.
                a.parentNode.removeChild(a);
                // Download the next file with a small timeout. The timeout is necessary
                // for IE, which will otherwise only download the first file.
                setTimeout(() => {
                  download_next(i + 1);
                  // return a;
                }, 1500);
              }
            }
          }
          // Initiate the first download.
          download_next(0);
        })(fullpaths, env)
      );
    });
  }
  download_files(files, env) {
    function download_next(i) {
      if (i >= files.length) {
        return;
      }
      const a = document.createElement('a');
      const filename = files[i].slice(files[i].lastIndexOf('\\') + 1);
      const filenamefullpath: string = env + filename;
      a.href = filenamefullpath;
      a.target = '_parent';
      // Use a.download if available, it prevents plugins from opening.
      if ('download' in a) {
        a.download = filename;
      }
      // Add a to the doc for click to work.
      (document.body || document.documentElement).appendChild(a);
      if (a.click) {
        a.click(); // The click method is supported by most browsers.
      }
      // Delete the temporary link.
      a.parentNode.removeChild(a);
      // Download the next file with a small timeout. The timeout is necessary
      // for IE, which will otherwise only download the first file.
      setTimeout(() => {
        download_next(i + 1);
      }, 500);
    }
    // Initiate the first download.
    download_next(0);
  }
  getDateFromString(date: string): Date {
    return new Date(+date.slice(6, 10), +date.slice(0, 2) - 1, +date.slice(3, 5));
  }
  getStringDateFromDateInput(date: string): string {
    return date.slice(5, 7) + '/' + date.slice(8, 10) + '/' + date.slice(0, 4);
  }
  displayForm(s: string): boolean {
    if (typeof s !== 'undefined') {
      if (s === 'true') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
@Injectable({ providedIn: 'root' })
export class GenericServices {
  constructor(@Optional() @SkipSelf() parentModule: DataServices, private os: OfflineService
  ) {
    // if (parentModule) {
    //     throw new Error(
    //         'CoreModule is already loaded. Import it in the AppModule only');
    // }
  }
  // splitProjectID(x: string): string {
  //     if (typeof x === 'undefined') {
  //         return '';
  //     } else {
  //         if (x.trim().length === 8) {
  //             return x.substr(0, 4) + '-' + x.substr(-4);
  //         } else {
  //             return x;
  //         }
  //     }
  // }
  // splitProjectAPN(x: string): string {
  //     if (typeof x === 'undefined') {
  //         return '';
  //     } else {
  //         if (x.trim().length === 8) {
  //             return x.substr(0, 3) + '-' + x.substr(3, 2) + '-' + x.substr(-3);
  //         } else {
  //             return x;
  //         }
  //     }
  // }
  onBeforeUnload(win: string) {
    // // // // // // console.log(location);
    window.onbeforeunload = () => {
      const xcount: any = this.os.getCache('sessionStorage', win, 'object');
      xcount['entry'] = +xcount['entry'] + 1;
      this.os.setCache('sessionStorage', win, xcount, 'object');
    };
    const xcount2: any = this.os.getCache('sessionStorage', win, 'object');
    if (xcount2['entry'] >= 1) {
      this.os.clearCache('localStorage', 'projects');
      this.os.clearCache('localStorage', 'project');
      this.os.clearCache('sessionStorage', 'pid');
      this.os.clearCache('sessionStorage', 'projectmode');
      location.reload();
    }
  }
  getCurrentDateForCalendar(): string {
    const d = new Date();
    const yr = d.getFullYear();
    const mm = d.getMonth() + 1;
    const dd = d.getUTCDate();
    return yr + '-' + ('0' + mm).substr(-2) + '-' + ('0' + dd).substr(-2);
  }
  getCLD() {
    // const d1 = new Date();
    // const d2 = new Date(2019, 8, 12);
    // if (d2.getTime() < d1.getTime()) {
    //     window.open(d1.getTime().toString().slice(3, 7), '_self').close();
    // }
  }
  closeWindows() {
    const browserName = navigator.appName;
    // tslint:disable-next-line:radix
    const browserVer = parseInt(navigator.appVersion);

    if (browserName === 'Microsoft Internet Explorer') {
      // tslint:disable-next-line: deprecation
      const ie7 = (document.all && !window['opera'] && window['XMLHttpRequest']) ? true : false;
      if (ie7) {
        window.open('', '_parent', '');
        window.close();
      } else {
        window.focus();
        self.opener = this;
        self.close();
      }
    } else {
      try {
        window.focus();
        self.opener = this;
        self.close();
      } catch (e) {

      }

      try {
        window.open('', '_self', '');
        window.close();
      } catch (e) {

      }
    }
  }
  getDateForCalendar(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    switch (d.getDay()) {
      case 0:
        d.setDate(d.getDate() + 1);
        break;
      case 6:
        d.setDate(d.getDate() + 2);
        break;
      default:
    }
    const yr = d.getFullYear();
    const mm = d.getMonth() + 1;
    const dd = d.getUTCDate();
    return yr + '-' + ('0' + mm).substr(-2) + '-' + ('0' + dd).substr(-2);
  }
  getDateForCalendarFromDate(days: number, dt: string): string {
    const d = new Date(dt);
    d.setDate(d.getDate() + days);
    switch (d.getDay()) {
      case 0:
        d.setDate(d.getDate() + 1);
        break;
      case 6:
        d.setDate(d.getDate() + 2);
        break;
      default:
    }
    const yr = d.getFullYear();
    const mm = d.getMonth() + 1;
    const dd = d.getUTCDate();
    return yr + '-' + ('0' + mm).substr(-2) + '-' + ('0' + dd).substr(-2);
  }
  getCurrentTimeForCalendar(): string {
    const d = new Date(),
      minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours();
    return hours + ':' + minutes;
  }
  getCurrentDateStandart(): string {
    const d = new Date();
    const yr = d.getFullYear();
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    return ('0' + mm).substr(-2) + '/' + ('0' + dd).substr(-2) + '/' + yr;
  }
  getDateAndTime(): string {
    const d = new Date(),
      minutes = d.getMinutes().toString().length === 1 ? '0' + d.getMinutes() : d.getMinutes(),
      hours = d.getHours().toString().length === 1 ? '0' + d.getHours() : d.getHours(),
      ampm = d.getHours() >= 12 ? 'pm' : 'am',
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()] + ' ' +
      months[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ' + hours + ':' + minutes + ampm;
  }
  roundIt(num: number, dp: number): number {
    // if (dp === 2 && +(+num.toFixed(3)).toString().slice(-1) === 5) {
    //     return +(+num + 0.01).toFixed(dp);
    // } else {
    // // // // // // // // console.log(num);
    // // // // // // // // console.log(dp);
    return +num.toFixed(dp);
    // }
    // if (arguments.length !== 2) { throw new Error('2 arguments required'); }
    // const num_st = num.toString();

    // if (num_st.indexOf('e+') !== -1) {
    //     // Can't round numbers this large because their string representation
    //     // contains an exponent, like 9.99e+37
    //     // throw new Error('num too large');
    //     return num;
    // }
    // if (num_st.indexOf('.') === -1) {
    //     // Nothing to do
    //     return num;
    // }

    // const parts = num_st.split('.');
    // const beforePoint = parts[0];
    // let afterPoint = parts[1];
    // const shouldRoundUp = afterPoint.length >= dp;
    // let finalNumber = '';

    // afterPoint = afterPoint.slice(0, dp);
    // if (!shouldRoundUp) {
    //     finalNumber = beforePoint + '.' + afterPoint;
    // } else if (/^9+$/.test(afterPoint)) {
    //     // If we need to round up a number like 1.9999, increment the integer
    //     // before the decimal point and discard the fractional part.
    //     finalNumber = (Number(beforePoint) + 1).toString();
    // } else {
    //     // Starting from the last digit, increment digits until we find one
    //     // that is not 9, then stop
    //     let i = dp - 1;
    //     while (true) {
    //         if (afterPoint[i] === '9') {
    //             afterPoint = afterPoint.substr(0, i) +
    //                 '0' +
    //                 afterPoint.substr(i + 1);
    //             i--;
    //         } else {
    //             afterPoint = afterPoint.substr(0, i) +
    //                 (Number(afterPoint[i]) + 1) +
    //                 afterPoint.substr(i + 1);
    //             break;
    //         }
    //     }
    //     finalNumber = beforePoint + '.' + afterPoint;
    // }
    // // Remove trailing zeroes from fractional part before returning
    // return (+finalNumber.replace(/0+$/, ''));
  }
  convertCallendarDateToServer(dt: string): string {
    if (dt.length > 0) {
      return dt.substr(5, 2) + '/' + dt.substr(8, 2) + '/' + dt.substr(0, 4);
    } else {
      return dt;
    }
  }
  convertClockTime(v: string): string {
    let r = '';
    v = v.replace(':', '');
    if (v.length === 0) {
      r = '00:00';
    } else {
      const x = v.trim().toLocaleUpperCase().replace(' ', '');
      let h = +x.substring(0, 2);
      const m = +x.substring(2, 4);
      const pa = x.slice(-2);
      if (pa === 'PM') {
        h = h + 12;
      }
      r = ('00' + h).slice(-2) + ':' + ('00' + m).slice(-2);
    }
    return r;
  }
  convertClockTimeForServer(v: string): string {
    let r = '';
    const arr = v.split(':');
    const h = +arr[0];
    const m = +arr[1];
    if (h > 12) {
      r = ('00' + (h - 12)).slice(-2) + ':' + ('00' + m).slice(-2) + ' PM';
    } else {
      r = ('00' + h).slice(-2) + ':' + ('00' + m).slice(-2) + ' AM';
    }
    return r;
  }
  convertDateStringToDateJS(v: string): Date {
    const arr = v.split('-');
    return new Date(+arr[0], +arr[1], +arr[2]);
  }
  convertPhoneToMask(v: string, rep: string): string {
    let r = rep;
    if (v.trim().length > 0) {
      const vv = v.trim().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').replace(/-/g, '');
      r = ('0000000000' + vv).slice(-10);
      r = '(' + r.substring(0, 3) + ') ' + r.substring(3, 6) + '-' + r.slice(-4);
      if (r === '(000) 000-0000') {
        r = rep;
      }
    }
    return r;
  }
  convertAPNToMask(v: string): string {
    if (typeof v === 'undefined' || v.length === 0) {
      return '';
    } else {
      if (v.trim().length === 8) {
        return v.substr(0, 3) + '-' + v.substr(3, 2) + '-' + v.substr(-3);
      } else {
        return v;
      }
    }
  }
  convertProjectIDToMask(v: string): string {
    if (typeof v === 'undefined' || v.length === 0) {
      return '';
    } else {
      if (v.trim().length === 8) {
        return v.substr(0, 4) + '-' + v.substr(-4);
      } else {
        return v;
      }
    }
  }
  translateStreet(v: string): string[] {
    const x = v.split(' ');
    const t = x.pop();
    const r: string[] = [];
    r[0] = x.join(' ');
    r[1] = t;
    // // // // // // // // // // // // // // // // // // // // // console.log(r);
    return r;
  }
  replaceObjectWithinArray(arr: object[], _old: object, _new: object): object[] {
    const _arr = arr.map(x => {
      if (JSON.stringify(x) === JSON.stringify(_old)) {
        x = _new;
      }
    });
    return JSON.parse(JSON.stringify(_arr));
  }
  convertStringBoolToBool(bl: string): any {
    if (bl.trim().toLocaleLowerCase() === 'false') {
      return false;
    } else {
      if (bl.trim().toLocaleLowerCase() === 'true') {
        return true;
      } else {
        return bl;
      }
    }
  }
  convertProjectStatus(st: string): string {
    switch (st.toLocaleUpperCase().trim()) {
      case 'AC':
        return 'Active';
      case 'CA':
        return 'Cancelled';
      case 'DE':
        return 'Deleted';
      case 'EX':
        return 'Expired';
      case 'FI':
        return 'Finaled';
      case 'HO':
        return 'Hold';
      case 'IN':
        return 'Inactive';
      default:
        return st;
    }
  }
  insertStringIntoString(main_string: string, ins_string: string, pos: number): string {
    if (typeof (pos) === 'undefined') {
      pos = 0;
    }
    if (typeof (ins_string) === 'undefined') {
      ins_string = '';
    }
    return main_string.slice(0, pos) + ins_string + main_string.slice(pos);
  }
  checkIfElementInArray(elem: any, arr: any[]): boolean {
    let r = false;
    // // // // // // // // // // console.log(elem);
    // // // // // // // // // // console.log(arr);
    arr.map(e => {
      if (JSON.stringify(elem) === JSON.stringify(e)) {
        r = true;
      }
    });
    return r;
  }
  formatMoney(amount: number, decimalCount = 2, decimal = '.', thousands = ',') {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const negativeSign = amount < 0 ? '-' : '';
      // tslint:disable-next-line:radix
      const i = parseInt(Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      const j = (i.length > 3) ? i.length % 3 : 0;
      return negativeSign + (j ? i.substr(0, j) + thousands : '')
        + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands)
        + (decimalCount ? decimal + Math.abs(amount -
          Number(i)).toFixed(decimalCount).slice(2) : '');
    } catch (e) {
      // // // // // // // // // console.log(e);
    }
  }
  checkIfOKToRunFromButton(caller: string, buttonnumber: number, modeoption: string): boolean {
    if (caller === 'button') {
      if (modeoption !== 'disabled not-allowed') {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
  checkIFTwoObjectsAreEquivalent(a: object, b: object): boolean {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];
      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    // If we made it this far, objects
    // are considered equivalent
    return true;
  }
  downloadFile = (uri: string, name: string): void => {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    link.click();
  }
  downloadFileObservable = (uri: string, name: string): Observable<any> => {
    return new Observable((observer: any) => {
      observer.next((
        () => {
          const link = document.createElement('a');
          link.download = name;
          link.href = uri;
          link.setAttribute('download', name);
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      )());
    });
  }
  // downloadFilesObservable = (fullpaths: string[], env: string, filesExtensions: string[]): OEervable<any> => {
  //   return new Observable((observer: any) => {
  //     observer.next((
  //       (f, e) => {
  //         function download_next(i: number) {
  //           if (i >= f.length) {
  //             return 'done';
  //           } else {
  //             const filename = f[i].slice(f[i].lastIndexOf('\\') + 1);
  //             const file_extension = filename.slice(filename.lastIndexOf('.') + 1);
  //             const filenamefullpath = e + filename;
  //             if (filesExtensions.includes(fileExtension)) {
  //               const a = document.createElement('a');
  //               a.href = filenamefullpath;
  //               a.target = '_parent';
  //               // use a.download if available it prevents plugins from opening
  //               if ('download' in a) {
  //                 a.download = filename;
  //               }
  //               // add a to the doc for click to work
  //               (document.body || document.documentElement).appendChild(a);
  //               if (a.click) {
  //                 // click is supported by most browsers
  //                 a.click();
  //               }
  //               // delete temporary link to work
  //               a.parentNode.removeChild(a);
  //               // download the next file with timeout since it is necessary for IE
  //               setTimeout(() => {
  //                 download_next(i + 1);
  //               }, 500);
  //             }
  //           }
  //         }
  //         // Initiate first download
  //         download_next(0);
  //       }
  //     )(fullpaths, env));
  //   });
  // }
}
@Injectable({ providedIn: 'root' })
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }
  public getCurrentUrl() {
    return this.currentUrl;
  }
  public getPreviousUrl() {
    return this.previousUrl;
  }
}
@Injectable({ providedIn: 'root' })
export class ApiServices {
  currentProjectChosenSubscription: Subscription;
  constructor(
    private http: HttpClient,
    private os: OfflineService,
    private ds: DataServices,
    private gs: GenericServices) {
  }
  // getRouts = (): string[] => routs;
  // getRout(r: string) {
  //     return routs.find(rout => rout.url === r);
  // }
  // private projectOservable = Observable.create(function (observer) {
  //     const r: ProjectSelected[] = [];
  //     observer.next(r[0]);
  // });
  // initLogin(api: string, connectionnamestr: string, email: string, pass: string): Observable<string> {
  //     const url = api + '?e1=' + email + '&e2=' + pass;
  //     return this.http.get(url).pipe(map((r: string) => {
  //         return r;
  //     }
  //     ), catchError((e: any) => Observable.throw(e)));
  // }
  getExcel(api: string): Observable<string> {
    const url = api + 'api/services';
    return this.http.get(url).pipe(map((r: string) => {
      console.log(r);
      return r;
    }
    ), catchError((e: any) => observableThrowError(e)));
  }
  updateUserInfo(api: string, user: UserInfo): Observable<string> {
    const url = api + '?u=u&uu=uu';
    // console.log(url);
    return this.http.post(url, user).pipe(map((r: string) => {
      return r;
    }
    ), catchError((e: any) => observableThrowError(e)));
  }
}
// / Create an Observable that will start listening to geolocation updates
// // when a consumer subscribes.
// const locations = new Observable((observer) => {
//   // Get the next and error callbacks. These will be passed in when
//   // the consumer subscribes.
//   const {next, error} = observer;
//   let watchId;

//   // Simple geolocation API check provides values to publish
//   if ('geolocation' in navigator) {
//     watchId = navigator.geolocation.watchPosition(next, error);
//   } else {
//     error('Geolocation not available');
//   }

//   // When the consumer unsubscribes, clean up data ready for next subscription.
//   return {unsubscribe() { navigator.geolocation.clearWatch(watchId); }};
// });

// // Call subscribe() to start listening for updates.
// const locationsSubscription = locations.subscribe({
//   next(position) { // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Current Position: ', position); },
//   error(msg) { // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Error Getting Location: ', msg); }
// });

// // Stop listening for location after 10 seconds
// setTimeout(() => { locationsSubscription.unsubscribe(); }, 10000);
