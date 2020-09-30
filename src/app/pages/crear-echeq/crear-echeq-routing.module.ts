import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearEcheqPage } from './crear-echeq.page';

const routes: Routes = [
  {
    path: '',
    component: CrearEcheqPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearEcheqPageRoutingModule {}
