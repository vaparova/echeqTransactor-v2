import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


import { TabPage } from './tab/tab.page';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { SubseccionesComponent } from './subsecciones/subsecciones.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { PasswordComponent } from './password/password.component';
import { TokenComponent } from './token/token.component';


import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { EnviarTokenComponent } from './enviar-token/enviar-token.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { environment } from '../../environments/environment';



@NgModule({
  declarations: [
    TabPage,
    CabeceraComponent,
    NotificacionesComponent,
    CalendarioComponent,
    SubseccionesComponent,
    DatosPersonalesComponent,
    PasswordComponent,
    TokenComponent,
    EnviarTokenComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MbscModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  exports: [
    TabPage,
    CabeceraComponent,
    NotificacionesComponent,
    CalendarioComponent,
    SubseccionesComponent,
    DatosPersonalesComponent,
    PasswordComponent,
    TokenComponent,
    EnviarTokenComponent
  ],
  providers: [
    AngularFireAuth
  ]
})
export class ComponentsModule { }
