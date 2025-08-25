import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { FormsModule } from '@angular/forms';
import { App } from './app';
import { PageLogin } from './pages/page-login/page-login';
import { PageNavigation } from './pages/page-navigation/page-navigation';
import { PageSettings } from './pages/page-settings/page-settings';
import { SearchBar } from './pages/search-bar/search-bar';
import { MainContainer } from './pages/main-container/main-container';
import { TableEmpresa } from './pages/table-empresas/table-empresas';
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
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CadastroJovem } from './pages/cadastro-jovem/cadastro-jovem';
import { CadastroEmpresa } from './pages/cadastro-empresa/cadastro-empresa';
import { CadastroUsuario } from './pages/cadastro-usuario/cadastro-usuario';
import { Email } from './pages/componentes-settings/email/email';
import { Preferencias } from './pages/componentes-settings/preferencias/preferencias';
import { Seguranca } from './pages/componentes-settings/seguranca/seguranca';
import { Servidor } from './pages/componentes-settings/servidor/servidor';
import { Usuarios } from './pages/componentes-settings/usuarios/usuarios';

@NgModule({
  declarations: [
    App,
    PageLogin,
    PageNavigation,
    PageSettings,
    SearchBar,
    MainContainer,
    TableEmpresa,
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
    PageRegister,
    CadastroJovem,
    CadastroEmpresa,
    CadastroUsuario,
    Email,
    Servidor,
    Preferencias,
    Seguranca,
    Usuarios
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch())  
  ],
  bootstrap: [App]
})
export class AppModule { }
