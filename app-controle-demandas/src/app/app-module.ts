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
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FilterCidadaoPipe } from './pipes/filter-cidadao-pipe';
import { CidadaoEditar } from './components/modals/cidadao-editar/cidadao-editar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListarDemandasCidadao } from './components/modals/listar-demandas-cidadao/listar-demandas-cidadao';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

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
    PageRegister,
    FilterCidadaoPipe,
    CidadaoEditar,
    ListarDemandasCidadao
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatListModule,
    MatProgressSpinnerModule
],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ],
  bootstrap: [App]
})
export class AppModule { }
