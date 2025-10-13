// Angular Core e Plataforma
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

// Rotas e App
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';

// Componentes de Demanda
import { DemandaList } from './components/componentes-demanda/demanda-list/demanda-list';
import { DemandaForm } from './components/componentes-demanda/demanda-form/demanda-form';
import { DemandaEdit } from './components/componentes-demanda/demanda-edit/demanda-edit';
import { DemandaEditar } from './components/modals/demanda-editar/demanda-editar';
import { ListarDemandasCidadao } from './components/modals/listar-demandas-cidadao/listar-demandas-cidadao';
import { FilterDemandaPipe } from './pipes/filter-demanda-pipe';

// Componentes de Cidadão
import { CidadaoList } from './components/componentes-cidadao/cidadao-list/cidadao-list';
import { CidadaoForm } from './components/componentes-cidadao/cidadao-form/cidadao-form';
import { CidadaoEdit } from './components/componentes-cidadao/cidadao-edit/cidadao-edit';
import { CidadaoEditar } from './components/modals/cidadao-editar/cidadao-editar';
import { FilterCidadaoPipe } from './pipes/filter-cidadao-pipe';

// Páginas
import { PageHome } from './pages/page-home/page-home';
import { PageRegister } from './pages/page-register/page-register';

// Outros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    // App e Navbar
    App,
    Navbar,

    // Páginas
    PageHome,
    PageRegister,

    // Componentes de Cidadão
    CidadaoList,
    CidadaoForm,
    CidadaoEdit,
    CidadaoEditar,
    
    // Componentes de Demanda
    DemandaList,
    DemandaForm,
    DemandaEdit,
    DemandaEditar,
    ListarDemandasCidadao
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FilterCidadaoPipe,
    FilterDemandaPipe,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,

    // Angular Material
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    
    MatExpansionModule,

    // Outros
    SweetAlert2Module.forRoot()
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
