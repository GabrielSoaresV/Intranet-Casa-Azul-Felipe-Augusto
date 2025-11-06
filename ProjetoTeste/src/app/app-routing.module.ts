import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PageHome } from './components/page-home/page-home';
import { PageLogin } from './components/page-login/page-login';
import { TableDemands } from './components/table-demands/table-demands';
import { PageProfile } from './components/profile/profile';
import { ProfilesList } from './components/profiles-list/profiles-list';
import { DemandHistoryList } from './components/demand-history/demand-history';
import { PageDemandRegister } from './components/page-demand-register/page-demand-register';
import { PageChat } from './components/page-chat/page-chat';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLogin },
  { path: 'home', component: PageHome, canActivate: [AuthGuard] },
  { path: 'demands',component: TableDemands, canActivate: [AuthGuard]},
  { path: 'history',component: DemandHistoryList, canActivate: [AuthGuard]},
  { path: 'profile', component: PageProfile, canActivate: [AuthGuard] },
  { path: 'profile-list', component: ProfilesList, canActivate: [AuthGuard] },
  { path: 'demand-register', component: PageDemandRegister, canActivate: [AuthGuard] },
  { path: 'chat/:id', component: PageChat, canActivate: [AuthGuard] },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
