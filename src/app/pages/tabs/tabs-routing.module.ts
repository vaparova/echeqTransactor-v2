import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsPage } from './tabs.page';

// const routes: Routes = [
//   {
//     path: 'tab',
//     loadChildren: () => import('../../components/tab/tab.module').then( m => m.TabPageModule)
//   },
//   {
//     path: '',
//     redirectTo: 'tab',
//     pathMatch: 'full'
//   },
//   {
//     path: 'eventos',
//     loadChildren: () => import('../../pages/eventos/eventos.module').then( m => m.EventosPageModule)
//   },
//   // {
//   //   path: 'ingreso',
//   //   loadChildren: () => import('../../pages/ingreso/ingreso.module').then( m => m.IngresoPageModule)
//   // }
// ];

const routes: Routes = [
  {
    path: 'tab',
    component: TabsPage,
    children: [
      {
        path: 'crearEcheq',
        loadChildren: () => import('../crear-echeq/crear-echeq.module').then( m => m.CrearEcheqPageModule)
      },
      {
        path: 'echeqRecibidos',
        loadChildren: () => import('../echeq-recibidos/echeq-recibidos.module').then( m => m.EcheqRecibidosPageModule)
      },
      {
        path: 'index',
        loadChildren: () => import('../index/index.module').then( m => m.IndexPageModule)
      },
      {
        path: 'miCuenta',
        loadChildren: () => import('../mi-cuenta/mi-cuenta.module').then( m => m.MiCuentaPageModule)
      },
      {
        path: '',
        redirectTo: '/tab/index',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: '',
    redirectTo: '/tab/index',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
