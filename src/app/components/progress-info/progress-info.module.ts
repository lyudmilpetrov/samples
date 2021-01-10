
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressInfoComponent } from './progress-info.component';
// import { ProgressInfoServices } from './progress-info.services';

@NgModule({
    imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule
    ],
    declarations: [ProgressInfoComponent],
    // providers: [ProgressInfoServices],
    exports: [
        ProgressInfoComponent
    ]
})

export class ProgressInfoModule {

}



