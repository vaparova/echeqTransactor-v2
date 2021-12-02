import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


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
import { CuentasComponent } from './cuentas/cuentas.component';
import { ChequerasElectronicasComponent } from './chequeras-electronicas/chequeras-electronicas.component';
import { NuevaChequeraComponent } from './nueva-chequera/nueva-chequera.component';
import { LoginComponent } from './login/login.component';
import { MisEcheqsComponent } from './mis-echeqs/mis-echeqs.component';
import { NuevoEcheqComponent } from './nuevo-echeq/nuevo-echeq.component';
import { EcheqGeneradosComponent } from './echeq-generados/echeq-generados.component';
import { EcheqLibradosComponent } from './echeq-librados/echeq-librados.component';
import { GenerarComprobanteComponent } from './generar-comprobante/generar-comprobante.component';
import { EcheqRecibidosComponent } from './echeq-recibidos/echeq-recibidos.component';
import { EcheqDepositadosComponent } from './echeq-depositados/echeq-depositados.component';



@NgModule({
  declarations: [
    CabeceraComponent,
    NotificacionesComponent,
    CalendarioComponent,
    SubseccionesComponent,
    DatosPersonalesComponent,
    PasswordComponent,
    TokenComponent,
    EnviarTokenComponent,
    CuentasComponent,
    ChequerasElectronicasComponent,
    NuevaChequeraComponent,
    LoginComponent,
    MisEcheqsComponent,
    NuevoEcheqComponent,
    EcheqGeneradosComponent,
    EcheqLibradosComponent,
    GenerarComprobanteComponent,
    EcheqRecibidosComponent,
    EcheqDepositadosComponent
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
    CabeceraComponent,
    NotificacionesComponent,
    CalendarioComponent,
    SubseccionesComponent,
    DatosPersonalesComponent,
    PasswordComponent,
    TokenComponent,
    EnviarTokenComponent,
    CuentasComponent,
    ChequerasElectronicasComponent,
    NuevaChequeraComponent,
    LoginComponent,
    MisEcheqsComponent,
    NuevoEcheqComponent,
    EcheqGeneradosComponent,
    EcheqLibradosComponent,
    GenerarComprobanteComponent,
    EcheqRecibidosComponent,
    EcheqDepositadosComponent
  ],
  providers: [
    AngularFireAuth
  ]
})
export class ComponentsModule { }
