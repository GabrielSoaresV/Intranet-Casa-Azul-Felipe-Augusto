import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { DemandListComponent } from './features/demands/demand-list/demand-list.component';
import { DemandDetailComponent } from './features/demands/demand-detail/demand-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'demands', component: DemandListComponent, canActivate: [AuthGuard] },
  { path: 'demands/:id', component: DemandDetailComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/demands', pathMatch: 'full' },
  { path: '**', redirectTo: '/demands' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
