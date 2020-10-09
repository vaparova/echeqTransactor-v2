import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


import { TabPage } from './tab/tab.page';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { SubseccionesComponent } from './subsecciones/subsecciones.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';


import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';



@NgModule({
  declarations: [
    TabPage,
    CabeceraComponent,
    NotificacionesComponent,
    CalendarioComponent,
    SubseccionesComponent,
    DatosPersonalesComponent
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
    CalendarioComponent,
    SubseccionesComponent,
    DatosPersonalesComponent
  ]
})
export class ComponentsModule { }
