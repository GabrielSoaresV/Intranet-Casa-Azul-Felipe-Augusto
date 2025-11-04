import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PageHome } from './components/page-home/page-home';
import { PageLogin } from './components/page-login/page-login';
import { TableDemands } from './components/table-demands/table-demands';
import { PageProfile } from './components/profile/profile';
import { ProfilesList } from './components/profiles-list/profiles-list';
import { DemandHistoryList } from './components/demand-history/demand-history';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLogin },
  { path: 'home', component: PageHome, canActivate: [AuthGuard] },
  { path: 'demands',component: TableDemands, canActivate: [AuthGuard]},
  { path: 'history',component: DemandHistoryList, canActivate: [AuthGuard]},
  { path: 'profile', component: PageProfile, canActivate: [AuthGuard] },
  { path: 'profile-list', component: ProfilesList, canActivate: [AuthGuard] },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
