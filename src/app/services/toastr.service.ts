import { InjectionToken } from '@angular/core';
export let TOASTR_TOKEN = new InjectionToken<Toastr>('toastr');

export interface Toastr {
  options: {
    positionClass: string;
  };
  success(message: string, title?: string): void;
  info(message: string, title?: string): void;
  warning(message: string, title?: string): void;
  error(message: string, title?: string): void;
  setTopCentered(): void;
}

// import { SkipSelf } from '@angular/core';
// import { Injectable, Optional } from '@angular/core';
// import * as toastr from 'toastr';
// @Injectable({
//   providedIn: 'root'
// })

// export class ToastrService {
//   constructor(@Optional() @SkipSelf() parentModule: ToastrService
//   ) {
//     if (parentModule) {
//       throw new Error(
//         'CoreModule is already loaded. Import it in the AppModule only');
//     }
//   }
//   success(message: string, title?: string) {
//     toastr.success(message, title);
//   }
//   info(message: string, title?: string) {
//     toastr.info(message, title);
//   }
//   warning(message: string, title?: string) {
//     toastr.warning(message, title);
//   }
//   error(message: string, title?: string) {
//     toastr.error(message, title);
//   }
//   setTopCentered() {
//     toastr.options.positionClass = 'toast-top-center';
//   }
// }
