import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tab',
    loadChildren: () => import('./components/tab/tab.module').then( m => m.TabPageModule)
  },
  {
    path: '',
    redirectTo: 'tab',
    pathMatch: 'full'
  },
  {
    path: 'alerta/:id', // modificación del path agregando un parámetro id
    loadChildren: () => import('./pages/alerta/alerta.module').then( m => m.AlertaPageModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./pages/eventos/eventos.module').then( m => m.EventosPageModule)
  },
  {
    path: 'sector-mi-cuenta/:i',
    loadChildren: () => import('./pages/sector-mi-cuenta/sector-mi-cuenta.module').then( m => m.SectorMiCuentaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
