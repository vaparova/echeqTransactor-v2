import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'crearEcheq',
    loadChildren: () => import('../../pages/crear-echeq/crear-echeq.module').then( m => m.CrearEcheqPageModule)
  },
  {
    path: 'echeqRecibidos',
    loadChildren: () => import('../../pages/echeq-recibidos/echeq-recibidos.module').then( m => m.EcheqRecibidosPageModule)
  },
  {
    path: 'index',
    loadChildren: () => import('../../pages/index/index.module').then( m => m.IndexPageModule)
  },
  {
    path: 'miCuenta',
    loadChildren: () => import('../../pages/mi-cuenta/mi-cuenta.module').then( m => m.MiCuentaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabPageRoutingModule {}
