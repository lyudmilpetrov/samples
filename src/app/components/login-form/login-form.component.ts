import { Component, OnInit, Inject, NgZone, SkipSelf, Optional, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html'
})
export class LoginFormComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });
  @Output() submitEM = new EventEmitter();
    message = 'Are you sure?';
    confirmButtonText = 'Close';
    cancelButtonText = 'Cancel';
    constructor(
        @Optional() @SkipSelf() parentModule: LoginFormComponent,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<LoginFormComponent>,
        private ngZone: NgZone) {
        this.ngZone.run(() => {
            if (data) {
                this.message = data.message || this.message;
                // if (data.buttonText) {
                //     this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
                //     this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
                // }
            }
        });
    }
    onConfirmClick(): void {
        console.log('Close now');
        this.ngZone.run(() => {
            this.dialogRef.close('some info here');
        });
    }
    submit() {
      if (this.form.valid) {
        this.submitEM.emit(this.form.value);
      }
    }
}
