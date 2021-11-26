import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EcheqRecibidosPage } from './echeq-recibidos.page';

const routes: Routes = [
  {
    path: '',
    component: EcheqRecibidosPage
  },
  {
    path: 'sector-echeq-recibidos/:i',
    loadChildren: () => import('../sector-echeq-recibidos/sector-echeq-recibidos.module').then( m => m.SectorEcheqRecibidosPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcheqRecibidosPageRoutingModule {}
