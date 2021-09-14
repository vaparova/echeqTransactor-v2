import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearEcheqPage } from './crear-echeq.page';

const routes: Routes = [
  {
    path: '',
    component: CrearEcheqPage
  },
  {
    path: 'sector-mis-echeq/:i',
    loadChildren: () => import('../sector-mis-echeq/sector-mis-echeq.module').then( m => m.SectorMisEcheqPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearEcheqPageRoutingModule {}
