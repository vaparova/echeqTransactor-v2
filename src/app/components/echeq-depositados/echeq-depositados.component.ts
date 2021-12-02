import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActionSheetController, AlertController, NavController } from '@ionic/angular';
import { DatosBeneficiario } from 'src/app/models/datosBeneficiario';
import { DatosCoelsa } from 'src/app/models/datosCoelsa';
import { DatosCuentas } from 'src/app/models/datosCuentas';
import { DatosSesion } from 'src/app/models/datosSesion';
import { DatosUsuario } from 'src/app/models/datosUsuario';
import { ComprobantesServiceService } from 'src/app/providers/comprobantes-service.service';
import { ToastsService } from 'src/app/providers/toasts.service';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { VerificarPasswordService } from 'src/app/providers/verificar-password.service';

@Component({
  selector: 'app-echeq-depositados',
  templateUrl: './echeq-depositados.component.html',
  styleUrls: ['./echeq-depositados.component.scss'],
})
export class EcheqDepositadosComponent implements OnInit, OnDestroy {

  sesion: DatosSesion;
  usuario: DatosUsuario;
  echeqs: DatosCoelsa[] = [];
  vistaEcheqs: DatosCoelsa[] = [];
  echeq: DatosCoelsa;
  formaCtas: FormGroup;
  formaBenef: FormGroup;
  listaEntidades: DatosCuentas[] = [];
  cta: DatosCuentas;
  tenedor: DatosBeneficiario;
  accion: string;
  estado = 'Emitido - Pendiente';
  sinCuentas = false;
  vacio = false;
  verMenu = true;
  verListado = true;
  verEcheq = false;
  verCuentasDeposito = false;
  verEndoso = false;
  datosEcheq = false;
  datosCuenta = false;
  datosBeneficiario = false;

  constructor(private user: UsuariosService,
              private toast: ToastsService,
              private navCtrl: NavController,
              public actionSheetController: ActionSheetController,
              private cmprbte: ComprobantesServiceService,
              private pass: VerificarPasswordService,
              private alertController: AlertController,
              private fb: FormBuilder,
    ) { }

  ngOnInit() {
    this.obtenerData();
    this.buscarEcheqs();
  }

  ngOnDestroy(){
    this.sesion = null;
    this.usuario = null;
    this.echeqs = [];
    this.vistaEcheqs = [];
    this.echeq = null;
    this.formaCtas = null;
    this.listaEntidades = [];
    this.cta = null;
    this.accion = '';
    this.estado = '';
    this.sinCuentas = false;
    this.vacio = false;
    this.verMenu = false;
    this.verListado = false;
    this.verEcheq = false;
    this.verCuentasDeposito = false;
    this.datosEcheq = false;
    this.datosCuenta = false;
    this.datosBeneficiario = false;
  }

  segmentChanged(ev: any){
    console.log('algo');
    const estado = ev.detail.value.toString();
    this.estado = estado;
    this.filtrarEcheqs(estado);
    this.arrayVacio();
  }

  detalleEcheq(ev: any){
    const estado = ev.detail.value.toString();
    switch (estado){
      case 'datosEcheq':
        this.verDetalleEcheq(true, false, false);
        break;
      case 'datosCuenta':
        this.verDetalleEcheq(false, true, false);
        break;
      case 'datosBeneficiario':
        this.verDetalleEcheq(false, false, true);
        break;
    }
  }

  volver(){
    this.modificarVista(true, true, false, false, false);
    this.verDetalleEcheq(false, false, false);
  }

  mostrarMenu(i: number){
    // this.echeq = this.vistaEcheqs[i];
    this.setEcheqVista(i);
    switch (this.echeq.datosEcheq.estadoEcheq){
      case ('Depositado'):
      case ('Presentado'):
        this.menuDepositados(i);
        break;
      case ('Rechazado'):
        this.menuRechazados(i);
        break;
      case ('Acuerdo Pendiente'):
        this.menuAcordados(i);
        break;
    }
  }

  async menuDepositados(i: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class2',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true, false, false);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        icon: 'cloud-download-outline',
        handler: () => {
          // this.echeq = this.vistaEcheqs[i];
          this.setEcheqVista(i);
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta echeq');
        },
      },
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async menuRechazados(i: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class2',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true, false, false);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante CAC',
        icon: 'cloud-download-outline',
        handler: () => {
          // this.echeq = this.vistaEcheqs[i];
          this.setEcheqVista(i);
          this.cmprbte.comprobanteEcheqCAC(this.echeq, 'Certificado de Rechazo Echeq CAC');
        },
      },
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async menuAcordados(i: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class2',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true, false, false);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante CAC',
        icon: 'cloud-download-outline',
        handler: () => {
          // this.echeq = this.vistaEcheqs[i];
          this.setEcheqVista(i);
          this.cmprbte.comprobanteEcheqCAC(this.echeq, 'Certificado de Rechazo Echeq CAC');
        }
      }, {
        text: 'Aceptar Acuerdo',
        icon: 'thumbs-up-outline',
        handler: () => {
          // this.echeq = this.vistaEcheqs[i];
          this.setEcheqVista(i);
          this.confirmarModificarEcheq('aceptar acuerdo', 8);
        }
      }, {
        text: 'Rechazar Acuerdo',
        icon: 'thumbs-down-outline',
        handler: () => {
          // this.echeq = this.vistaEcheqs[i];
          this.setEcheqVista(i);
          this.confirmarModificarEcheq('rechazar acuerdo', 8);
        }
      },
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private setEcheqVista(i: number){
    this.echeq = this.vistaEcheqs[i];
    const idx = this.echeq.datosEcheq.endososEcheq.length - 1;
    this.tenedor = this.echeq.datosEcheq.endososEcheq[idx].endosatario;
  }

  private modificarVista(verMenu: boolean, verListado: boolean, verEcheq: boolean, verCtasDep: boolean, verEndoso: boolean){
    this.verMenu = verMenu;
    this.verListado = verListado;
    this.verEcheq = verEcheq;
    this.verCuentasDeposito = verCtasDep;
    this.verEndoso = verEndoso;
  }

  private verDetalleEcheq(datosEcheq: boolean, datosCuenta: boolean, datosBeneficiario: boolean){
    this.datosEcheq = datosEcheq;
    this.datosCuenta = datosCuenta;
    this.datosBeneficiario = datosBeneficiario;
  }

  private obtenerData(): void{
    const a = this.user.validarSesion();
    if (a){
      this.sesion = a;
      this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
      console.log(`respta obtenerUsuario() US: ${this.usuario}`);
      console.log(this.usuario);
    }else{
      this.user.borrarSesion();
      this.toast.mostrarToast('Debes iniciar sesión', 'danger');
      this.navCtrl.navigateBack('/ingreso');
      console.log('error de login!');
    }
  }

  private buscarEcheqs(){
    this.echeqs = [];
    this.echeqs = this.user.buscarEcheqCoelsaBeneficiario(this.sesion.cuil);
    setTimeout( () => {
      this.filtrarEcheqs('Depositado');
      this.arrayVacio();
    }, 2000);
  }

  private filtrarEcheqs(estado: string){
    this.vistaEcheqs = [];
    console.log(this.echeqs.length);

    switch (estado){
      case('Depositado'):
        Object.values(this.echeqs).forEach ( echeq => {
          if ( echeq.datosEcheq.estadoEcheq === estado || echeq.datosEcheq.estadoEcheq === 'Presentado'){
            this.vistaEcheqs.push(echeq);
          }
        });
        break;
      case ('Rechazado'):
        Object.values(this.echeqs).forEach ( echeq => {
          if ( echeq.datosEcheq.estadoEcheq === estado || echeq.datosEcheq.estadoEcheq === 'Acuerdo Pendiente'){
            this.vistaEcheqs.push(echeq);
          }
        });
        break;
    }
    console.log(this.vistaEcheqs);
  }

  private arrayVacio(){
    console.log(this.vistaEcheqs.length);
    if (this.vistaEcheqs.length < 1){
      this.vacio = true;
    }else{
      this.vacio = false;
    }
  }

  private async confirmarModificarEcheq(accion: string, estado: number): Promise<void> {
    const cap = accion.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    const title = `${cap} Echeq Nº ${this.echeq.datosEcheq.nroEcheq}`;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: `¿Estas seguro de ${accion} este Echeq?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.solicitarPassword(accion, estado);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  private elimEndoso(){
    this.echeq.datosEcheq.endososEcheq.pop();
  }

  private async solicitarPassword(accion: string, estado: number){
    console.log('Anulando Echeq');
    await this.pass.verificarPass(this.sesion.cuil).then( (resp) => {
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
          if (accion === 'aceptar acuerdo'){
            this.echeqAcordado(accion);
          }else{
            this.solicitarModificarEcheq(accion, estado);
          }
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
  }

  private echeqAcordado(accion){
    const long = this.echeq.datosEcheq.endososEcheq.length;
    switch (true){
      case (this.echeq.datosEcheq.endososEcheq.length > 1):
        // tiene más de un endoso.. debo eliminar ultimo endoso.. para retroceder en la cadena
        this.elimEndoso();
        this.solicitarModificarEcheq(accion, 8);
        break;
      case (this.echeq.datosEcheq.endososEcheq.length === 1):
        this.solicitarModificarEcheq(accion, 14);
    }
  }

  private solicitarModificarEcheq(accion: string, estado: number){
    this.user.accionEcheqCoelsa(this.echeq, estado).then( () => {
      this.buscarEcheqs();
      this.toast.mostrarToast(`Echeq modificado!`, 'primary');
      this.cmprbte.comprobanteEcheqCAC(this.echeq, `Constancia por ${accion} echeq`);
      this.navCtrl.navigateBack('tab/echeqRecibidos/sector-echeq-recibidos/2');
    }).catch( (err) => {
      this.toast.mostrarToast('Error en BD!', 'danger');
    });
  }

}
