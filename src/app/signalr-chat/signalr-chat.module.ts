import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SignalRChatRoutes } from './signalr-chat.routes';
import { SignalRChatComponent } from './signalr-chat.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { MaterialModule } from '@app/shared/material.module';

@NgModule({
    imports: [
        RouterModule.forChild(SignalRChatRoutes),
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MaterialModule
    ],
    declarations: [
        SignalRChatComponent,
        LoginUserComponent
    ],
    // providers: [DataServices, OfflineService, ApiServices, SearchServices, GetInputServices, GetInputYNServices, GenericServices],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class SignalRChatModule { }
