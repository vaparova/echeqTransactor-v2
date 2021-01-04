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
  // {
  //   path: 'eventos',
  //   loadChildren: () => import('../app/pages/eventos/eventos.module').then( m => m.EventosPageModule)
  // },
  {
    path: 'ingreso',
    loadChildren: () => import('../app/pages/ingreso/ingreso.module').then( m => m.IngresoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
