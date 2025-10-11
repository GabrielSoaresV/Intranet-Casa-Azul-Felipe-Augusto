import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
import { DemandaLista } from './components/demanda-lista/demanda-lista';
import { DemandaForm } from './components/demanda-form/demanda-form';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CidadaoLista } from './components/cidadao-lista/cidadao-lista';
import { PageHome } from './pages/page-home/page-home';
import { CidadaoForm } from './components/cidadao-form/cidadao-form';
import { FormsModule } from '@angular/forms';
import { PageRegister } from './pages/page-register/page-register';

@NgModule({
  declarations: [
    App,
    Navbar,
    DemandaLista,
    DemandaForm,
    CidadaoLista,
    PageHome,
    CidadaoForm,
    DemandaForm,
    PageRegister
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
