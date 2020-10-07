import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


import { TabPage } from './tab/tab.page';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { MisEcheqComponent } from './mis-echeq/mis-echeq.component';
import { EcheqRecibidosComponent } from './echeq-recibidos/echeq-recibidos.component';


import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';



@NgModule({
  declarations: [
    TabPage,
    CabeceraComponent,
    NotificacionesComponent,
    CalendarioComponent,
    MisEcheqComponent,
    EcheqRecibidosComponent
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
    MisEcheqComponent,
    EcheqRecibidosComponent
  ]
})
export class ComponentsModule { }
