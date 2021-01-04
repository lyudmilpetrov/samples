import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/shared/material.module';
import { FileUploadComponent } from './file-upload.component';

@NgModule({
    imports: [CommonModule, MaterialModule],
    declarations: [FileUploadComponent],
    // providers: [OverSpinnerServices],
    exports: [
        FileUploadComponent
    ]
})

export class FileUploadModule {
}
