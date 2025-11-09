// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ Necessário para routerLink, router-outlet, etc.

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// 🔹 Componentes principais
import { PageLogin } from './components/page-login/page-login';
import { PageProfile } from './components/profile/profile';
import { PageDemandRegister } from './components/page-demand-register/page-demand-register';
import { PageHome } from './components/page-home/page-home';
import { PageChat } from './components/page-chat/page-chat';
import { DemandHistoryList } from './components/demand-history/demand-history';
import { ProfilesList } from './components/profiles-list/profiles-list';
import { Navbar } from './components/navbar/navbar';
import { TableDemands } from './components/table-demands/table-demands';
import { ConfirmDialog } from './components/table-demands/confirm-dialog/confirm-dialog';
import { DemandsList } from './components/demands-list/demands-list';

// 🔹 Novos componentes de registro
import { PageRegisterPrivate } from './components/page-register-private/page-register-private';
import { PageRegisterPublic } from './components/page-register-public/page-register-public';

// 🔹 Angular Material
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
    ProfilesList,
    Navbar,
    DemandHistoryList,
    PageDemandRegister,
    TableDemands,
    PageChat,
    PageRegisterPrivate,
    PageRegisterPublic,
    ConfirmDialog,
    DemandsList
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule, // ✅ Import necessário para <a routerLink> e <router-outlet>
    AppRoutingModule,

    // ✅ Módulos do Angular Material
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
