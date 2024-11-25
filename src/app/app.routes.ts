import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard'; // Asegúrate de la ruta correcta
import { LoginComponentComponent } from './pages/auth/login-component/login-component.component';
import { IndexComponent } from './pages/dashboard/index/index.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { PerfilComponent } from './pages/dashboard/usuario/perfil/perfil.component';
import { SharedComponent } from './pages/sharedComponents/shared/shared.component';
import { AjustesComponent } from './pages/dashboard/usuario/ajustes/ajustes.component';

export const routes: Routes = [
  { path: '', component: LoginComponentComponent }, // Ruta principal
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: SharedComponent, // Aquí renderizas el layout con el header
    children: [
      { path: 'dashboard', component: IndexComponent }, // Ruta protegida
      // { path: 'dashboard', component: IndexComponent, canActivate: [AuthGuard] }, // Ruta protegida
      {
        path: 'tv/:nombre',
        loadComponent: () => import('./pages/dashboard/usuario/perfil/perfil.component').then(m => m.PerfilComponent),
        data: {
          // Puedes agregar datos de ruta si lo necesitas
          shouldReload: true
        }
      },
      {
        path: 'config', component: AjustesComponent, canActivate: [AuthGuard],
        children: [

        ]
      }, // Ruta protegida
    ]
  }
  // { path: 'dashboard', component: IndexComponent, canActivate: [AuthGuard] }, // Ruta protegida
  // {
  //   path: 'tv/:nombre',
  //   loadComponent: () => import('./pages/dashboard/usuario/perfil/perfil.component').then(m => m.PerfilComponent)
  // }// Ruta protegida
  // Otras rutas...
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
