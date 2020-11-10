import { Component, OnInit, Inject } from '@angular/core';
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
        @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<OverlayMessageComponent>) {
        if (data) {
            this.message = data.message || this.message;
            // if (data.buttonText) {
            //     this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
            //     this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
            // }
        }
    }

    onConfirmClick(): void {
        this.dialogRef.close('passing data here as string or object');
    }

}
