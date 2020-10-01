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
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
