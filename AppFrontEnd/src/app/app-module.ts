import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { PageHome } from './pages/page-home/page-home';
import { CidadaoForm } from './components/cidadao-form/cidadao-form';
import { CidadaoList } from './components/cidadao-list/cidadao-list';
import { DemandaForm } from './components/demanda-form/demanda-form';
import { DemandaList } from './components/demanda-list/demanda-list';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { CidadaoDemandasModal } from './components/modal/cidadao-demandas-modal/cidadao-demandas-modal';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    App,
    PageHome,
    CidadaoForm,
    CidadaoList,
    DemandaForm,
    DemandaList,
    CidadaoDemandasModal
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [App]
})
export class AppModule { }
