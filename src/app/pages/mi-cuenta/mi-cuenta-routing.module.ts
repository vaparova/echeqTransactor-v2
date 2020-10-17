import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MiCuentaPage } from './mi-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: MiCuentaPage
  },
  {
    path: 'sector-mi-cuenta/:i',
    loadChildren: () => import('../sector-mi-cuenta/sector-mi-cuenta.module').then( m => m.SectorMiCuentaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiCuentaPageRoutingModule {}
