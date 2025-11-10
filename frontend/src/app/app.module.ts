import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { PageLogin } from './features/login/pages/page-login/page-login';
import { PageRegisterPublic } from './features/login/pages/page-register-public/page-register-public';
import { PageRegisterPrivate } from './features/profiles/pages/page-register-private/page-register-private';
import { PageHome } from './features/home/pages/page-home/page-home';
import { PageProfile } from './features/profiles/pages/profile/profile';
import { PageDemandRegister } from './features/demands/pages/page-demand-register/page-demand-register';
import { PageChat } from './features/chat/pages/page-chat/page-chat';
import { Navbar } from './shared/navbar/navbar';
import { ConfirmDialog } from './shared/confirm-dialog/confirm-dialog';
import { TableDemands } from './features/demands/components/table-demands/table-demands';
import { DemandsList } from './features/demands/components/demands-list/demands-list';
import { DemandHistoryList } from './features/demands/components/demand-history/demand-history';
import { ProfilesList } from './features/profiles/components/profiles-list/profiles-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    PageLogin,
    PageHome,
    PageProfile,
    PageRegisterPublic,
    PageRegisterPrivate,
    PageDemandRegister,
    PageChat,
    Navbar,
    ConfirmDialog,
    TableDemands,
    DemandsList,
    DemandHistoryList,
    ProfilesList
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
