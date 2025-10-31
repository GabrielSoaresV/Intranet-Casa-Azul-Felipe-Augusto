import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { PageHome } from './components/page-home/page-home';
import { PageLogin } from './components/page-login/page-login';
import { TableDemands } from './components/table-demands/table-demands';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PageLogin },
  { path: 'home', component: PageHome, canActivate: [AuthGuard] },
  { path: 'demands',component: TableDemands, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
