import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { PageHome } from './components/page-home/page-home';
import { PageLogin } from './components/page-login/page-login';
import { PageRegisterPublic } from './components/page-register-public/page-register-public';
import { PageRegisterPrivate } from './components/page-register-private/page-register-private';
import { TableDemands } from './components/table-demands/table-demands';
import { PageProfile } from './components/profile/profile';
import { ProfilesList } from './components/profiles-list/profiles-list';
import { DemandHistoryList } from './components/demand-history/demand-history';
import { PageDemandRegister } from './components/page-demand-register/page-demand-register';
import { PageChat } from './components/page-chat/page-chat';
import { DemandsList } from './components/demands-list/demands-list';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLogin },
  { path: 'register-public', component: PageRegisterPublic },
  { path: 'register-private', component: PageRegisterPrivate, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] }},
  { path: 'home', component: PageHome, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: 'demands', component: TableDemands, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] } },
  { path: 'history', component: DemandHistoryList, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'profile', component: PageProfile, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: 'profile-list', component: ProfilesList, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT'] } },
  { path: 'demand-register', component: PageDemandRegister, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: 'demands-list', component: DemandsList, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'CITIZEN'] }},
  { path: 'chat/:id', component: PageChat, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN', 'ATTENDANT', 'CITIZEN'] } },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
