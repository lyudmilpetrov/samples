import { Component, OnInit, Inject, NgZone, SkipSelf, Optional } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-overlay-message',
    templateUrl: './overlay-message.component.html'
})
export class OverlayMessageComponent {
    message = 'Are you sure?';
    confirmButtonText = 'Close';
    cancelButtonText = 'Cancel';
    constructor(
        @Optional() @SkipSelf() parentModule: OverlayMessageComponent,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<OverlayMessageComponent>,
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
        // console.log('Close now');
        this.ngZone.run(() => {
            this.dialogRef.close('some info here');
        });
    }
}
