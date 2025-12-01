import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLogin } from './pages/page-login/page-login';
import { PageNavigation } from './pages/page-navigation/page-navigation';
import { PageGestao } from './pages/page-gestao/page-gestao';
import { PageSettings } from './pages/page-settings/page-settings';
import { PageRegister } from './pages/page-register/page-register'; 
import { Email } from './pages/componentes-settings/email/email';
import { Usuarios } from './pages/componentes-settings/usuarios/usuarios';
import { AvaliacaoForm } from './pages/avaliacao-form/avaliacao-form';
import { AuthGuard } from './service/auth.guard';
import { AlterarSenha } from './pages/alterar-senha/alterar-senha';
import { GerenciarRoles } from './pages/gerenciar-roles/gerenciar-roles';
import { EditarUsuario } from './pages/editar-usuario/editar-usuario';
import { ListarUsuarios } from './pages/listar-usuarios/listar-usuarios';
import { CadastroUsuario } from './pages/cadastro-usuario/cadastro-usuario';
import { PerfilUsuario } from './pages/perfil-usuario/perfil-usuario';

const routes: Routes = [
  { path: '', component: PageLogin },
  { path: 'navigation', component: PageNavigation },
  { path: 'gestao', component: PageGestao },
  { path: 'setting', component: PageSettings },
  { path: 'register', component: PageRegister },
  { path: 'email', component: Email},
  { path: 'avaliacao/:matricula', component: AvaliacaoForm},
  { path: 'usuario', component: Usuarios},
  { path: 'cadastro-usuario', component: CadastroUsuario },
  { path: 'listar-usuarios', component: ListarUsuarios, canActivate: [AuthGuard] },
  { path: 'editar-usuario/:username', component: EditarUsuario, canActivate: [AuthGuard] },
  { path: 'gerenciar-roles/:username', component: GerenciarRoles, canActivate: [AuthGuard] },
  { path: 'alterar-senha', component: AlterarSenha, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilUsuario, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


