import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SectorEcheqRecibidosPageRoutingModule } from './sector-echeq-recibidos-routing.module';

import { SectorEcheqRecibidosPage } from './sector-echeq-recibidos.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SectorEcheqRecibidosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SectorEcheqRecibidosPage]
})
export class SectorEcheqRecibidosPageModule {}
