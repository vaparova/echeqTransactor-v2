import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EcheqRecibidosPage } from './echeq-recibidos.page';

const routes: Routes = [
  {
    path: '',
    component: EcheqRecibidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EcheqRecibidosPageRoutingModule {}
