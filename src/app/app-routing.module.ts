import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tab',
    loadChildren: () => import('../app/pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: '',
    redirectTo: 'ingreso',
    pathMatch: 'full'
  },
  {
    path: 'ingreso',
    loadChildren: () => import('../app/pages/ingreso/ingreso.module').then( m => m.IngresoPageModule)
  },
  // {
  //   path: 'sector-echeq-recibidos',
  // loadChildren: () => import('./pages/sector-echeq-recibidos/sector-echeq-recibidos.module').then( m => m.SectorEcheqRecibidosPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
