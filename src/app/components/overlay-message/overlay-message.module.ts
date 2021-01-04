import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/shared/material.module';
import { OverlayMessageComponent } from './overlay-message.component';
@NgModule({
    imports: [CommonModule, MaterialModule],
    declarations: [OverlayMessageComponent],
    // providers: [OverSpinnerServices],
    exports: [
        OverlayMessageComponent
    ]
})

export class OverlayMessageModule {
}
