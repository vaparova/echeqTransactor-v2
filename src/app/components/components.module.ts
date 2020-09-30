import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPage } from './tab/tab.page';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    TabPage,
    CabeceraComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    TabPage,
    CabeceraComponent
  ]
})
export class ComponentsModule { }
