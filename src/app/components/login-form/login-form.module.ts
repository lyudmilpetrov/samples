import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/shared/material.module';
import { LoginFormComponent } from './login-form.component';
@NgModule({
    imports: [CommonModule, MaterialModule],
    declarations: [LoginFormComponent],
    // providers: [OverSpinnerServices],
    exports: [
        LoginFormComponent
    ]
})

export class LoginFormModule {
}
