import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { PageNavigation } from './pages/page-navigation/page-navigation';
import { PageGestao } from './pages/page-gestao/page-gestao';
import { PageSettings } from './pages/page-settings/page-settings';
import { PageRegister } from './pages/page-register/page-register'; 
import { Email } from './pages/componentes-settings/email/email';
import { Usuarios } from './pages/componentes-settings/usuarios/usuarios';

const routes: Routes = [
  { path: '', component: PageLogin },
  { path: 'navigation', component: PageNavigation },
  { path: 'gestao', component: PageGestao },
  { path: 'setting', component: PageSettings },
  { path: 'register', component: PageRegister },
  { path: 'email', component: Email},
  { path: 'usuario', component: Usuarios}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


