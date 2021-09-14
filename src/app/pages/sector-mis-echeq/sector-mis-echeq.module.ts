import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SectorMisEcheqPageRoutingModule } from './sector-mis-echeq-routing.module';

import { SectorMisEcheqPage } from './sector-mis-echeq.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SectorMisEcheqPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SectorMisEcheqPage]
})
export class SectorMisEcheqPageModule {}
