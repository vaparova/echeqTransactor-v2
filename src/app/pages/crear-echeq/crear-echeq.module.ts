import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearEcheqPageRoutingModule } from './crear-echeq-routing.module';

import { CrearEcheqPage } from './crear-echeq.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearEcheqPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CrearEcheqPage]
})
export class CrearEcheqPageModule {}
