import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { PageHome } from './features/home/pages/page-home/page-home';
import { PageLogin } from './features/login/pages/page-login/page-login';
import { PageRegisterPublic } from './features/login/pages/page-register-public/page-register-public';
import { PageRegisterPrivate } from './features/profiles/pages/page-register-private/page-register-private';
import { TableDemands } from './features/demands/components/table-demands/table-demands';
import { TableEmpresas } from './features/empresa/components/table-empresas/table-empresas';
import { TableJovens } from './features/jovem/components/table-jovens/table-jovens';
import { PageProfile } from './features/profiles/pages/profile/profile';
import { ProfilesList } from './features/profiles/components/profiles-list/profiles-list';
import { DemandHistoryList } from './features/demands/components/demand-history/demand-history';
import { PageDemandRegister } from './features/demands/pages/page-demand-register/page-demand-register';
import { PageEmpresaRegister } from './features/empresa/pages/page-empresa-register/page-empresa-register';
import { PageJovemRegister } from './features/jovem/pages/page-jovem-register/page-jovem-register';

import { PageChat } from './features/chat/pages/page-chat/page-chat';
import { DemandsList } from './features/demands/components/demands-list/demands-list';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLogin },
  { path: 'history', component: DemandHistoryList, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] }},
  { path: 'history/:id', component: DemandHistoryList, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] }},  
  { path: 'register-public', component: PageRegisterPublic },
  { path: 'register-private', component: PageRegisterPrivate, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
  { path: 'home', component: PageHome, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: 'demands', component: TableDemands, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] } },
  { path: 'empresas', component: TableEmpresas, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] } },
  { path: 'jovens', component: TableJovens, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] } },
  { path: 'profile', component: PageProfile, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: 'profile-list', component: ProfilesList, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] } },
  { path: 'demand-register', component: PageDemandRegister, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: 'empresa-register', component: PageEmpresaRegister, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: 'jovem-register', component: PageJovemRegister, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] } },
  { path: 'demands-list', component: DemandsList, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] }},
  { path: 'chat/:id', component: PageChat, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
