import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexPage } from './index.page';

const routes: Routes = [
  {
    path: '',
    component: IndexPage
  },
  {
    path: 'alerta/:id', // modificación del path agregando un parámetro id
    loadChildren: () => import('../alerta/alerta.module').then( m => m.AlertaPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexPageRoutingModule {}
