import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EcheqRecibidosPageRoutingModule } from './echeq-recibidos-routing.module';

import { EcheqRecibidosPage } from './echeq-recibidos.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EcheqRecibidosPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EcheqRecibidosPage]
})
export class EcheqRecibidosPageModule {}
