import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard'; // Asegúrate de la ruta correcta
import { LoginComponentComponent } from './pages/auth/login-component/login-component.component';
import { IndexComponent } from './pages/dashboard/index/index.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { PerfilComponent } from './pages/dashboard/usuario/perfil/perfil.component';

export const routes: Routes = [
  { path: '', component: LoginComponentComponent }, // Ruta principal
  { path: 'dashboard', component: IndexComponent, canActivate: [AuthGuard] }, // Ruta protegida
  { path: 'register', component: RegisterComponent },
  {
    path: 'tv/:nombre',
    loadComponent: () => import('./pages/dashboard/usuario/perfil/perfil.component').then(m => m.PerfilComponent)
  }// Ruta protegida
  // Otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
