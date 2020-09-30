import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPage } from './tab/tab.page';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { IonicModule } from '@ionic/angular';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';



@NgModule({
  declarations: [
    TabPage,
    CabeceraComponent,
    NotificacionesComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    TabPage,
    CabeceraComponent,
    NotificacionesComponent
  ]
})
export class ComponentsModule { }
