import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectorMisEcheqPage } from './sector-mis-echeq.page';

const routes: Routes = [
  {
    path: '',
    component: SectorMisEcheqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SectorMisEcheqPageRoutingModule {}
