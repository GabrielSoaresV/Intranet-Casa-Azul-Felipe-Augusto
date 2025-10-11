import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageHome } from './pages/page-home/page-home';
import { PageRegister } from './pages/page-register/page-register';

const routes: Routes = [
  { path: '', redirectTo: 'pagehome', pathMatch: 'full' },
  { path: 'pagehome', component: PageHome },
  { path: 'pageregister', component: PageRegister },
  { path: '**', redirectTo: 'pagehome' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
