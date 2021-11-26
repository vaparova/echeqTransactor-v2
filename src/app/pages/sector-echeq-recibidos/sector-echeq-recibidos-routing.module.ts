import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectorEcheqRecibidosPage } from './sector-echeq-recibidos.page';

const routes: Routes = [
  {
    path: '',
    component: SectorEcheqRecibidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectorEcheqRecibidosPageRoutingModule {}
