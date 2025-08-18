import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { PageLogin } from './pages/page-login/page-login';
import { PageNavigation } from './pages/page-navigation/page-navigation';
import { PageSettings } from './pages/page-settings/page-settings';
import { SearchBar } from './pages/search-bar/search-bar';
import { MainContainer } from './pages/main-container/main-container';
import { TableEmpresas } from './pages/table-empresas/table-empresas';
import { TableJovens } from './pages/table-jovens/table-jovens';
import { PageGestao } from './pages/page-gestao/page-gestao';
import { ButtonEmpresas } from './componentes/button-empresas/button-empresas';
import { ButtonJovens } from './componentes/button-jovens/button-jovens';
import { ButtonNavigation } from './componentes/button-navigation/button-navigation';
import { ButtonGestao } from './componentes/button-gestao/button-gestao';
import { ButtonPageRegister } from './componentes/button-page-register/button-page-register';
import { ButtonRegisterJovens } from './componentes/button-register-jovens/button-register-jovens';
import { ButtonRegisterEmpresas } from './componentes/button-register-empresas/button-register-empresas';
import { ButtonRegisterUser } from './componentes/button-register-user/button-register-user';
import { Navbar } from './componentes/navbar/navbar';
import { Menubar } from './componentes/menubar/menubar';
import { PageRegister } from './pages/page-register/page-register';

@NgModule({
  declarations: [
    App,
    PageLogin,
    PageNavigation,
    PageSettings,
    SearchBar,
    MainContainer,
    TableEmpresas,
    TableJovens,
    PageGestao,
    ButtonEmpresas,
    ButtonJovens,
    ButtonNavigation,
    ButtonGestao,
    ButtonPageRegister,
    ButtonRegisterJovens,
    ButtonRegisterEmpresas,
    ButtonRegisterUser,
    Navbar,
    Menubar,
    PageRegister
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
  ],
  bootstrap: [App]
})
export class AppModule { }
