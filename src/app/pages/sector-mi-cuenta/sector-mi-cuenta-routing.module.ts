import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectorMiCuentaPage } from './sector-mi-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: SectorMiCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectorMiCuentaPageRoutingModule {}
