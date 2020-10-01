import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPage } from './tab/tab.page';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { IonicModule } from '@ionic/angular';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { CalendarioComponent } from './calendario/calendario.component';


import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';



@NgModule({
  declarations: [
    TabPage,
    CabeceraComponent,
    NotificacionesComponent,
    CalendarioComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MbscModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  exports: [
    TabPage,
    CabeceraComponent,
    NotificacionesComponent,
    CalendarioComponent
  ]
})
export class ComponentsModule { }
