import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SectorMiCuentaPageRoutingModule } from './sector-mi-cuenta-routing.module';

import { SectorMiCuentaPage } from './sector-mi-cuenta.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SectorMiCuentaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SectorMiCuentaPage]
})
export class SectorMiCuentaPageModule {}
