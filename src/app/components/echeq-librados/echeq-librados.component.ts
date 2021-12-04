import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { DatosCoelsa } from '../../models/datosCoelsa';
import { DatosBeneficiario } from '../../models/datosBeneficiario';
import { ComprobantesServiceService } from '../../providers/comprobantes-service.service';
import { VerificarPasswordService } from '../../providers/verificar-password.service';
import { ToastsService } from '../../providers/toasts.service';
import { DatosSesion } from 'src/app/models/datosSesion';
import { DatosUsuario } from 'src/app/models/datosUsuario';


@Component({
  selector: 'app-echeq-librados',
  templateUrl: './echeq-librados.component.html',
  styleUrls: ['./echeq-librados.component.scss'],
})
export class EcheqLibradosComponent implements OnInit, OnDestroy {

  sesion: DatosSesion;
  usuario: DatosUsuario;
  vacio = false;
  echeqs: DatosCoelsa[] = [];
  vistaEcheqs: DatosCoelsa[] = [];
  echeq: DatosCoelsa;
  tenedor: DatosBeneficiario;
  estado = 'Emitido - Pendiente';
  verMenu = true;
  verListado = true;
  verEcheq = false;
  datosEcheq = false;
  datosCuenta = false;
  datosBeneficiario = false;


  constructor(private user: UsuariosService,
              public actionSheetController: ActionSheetController,
              private cmprbte: ComprobantesServiceService,
              private pass: VerificarPasswordService,
              private toast: ToastsService,
              private navCtrl: NavController,
              private alertController: AlertController) {
              }

  ngOnInit() {
    this.obtenerData();
    this.buscarEcheqs();
    this.user.agregarTiempo();
  }

  ngOnDestroy(): void {
    console.log('on destroy');
    this.echeq = null;
    this.echeqs = null;
    this.vistaEcheqs = null;
  }

  segmentChanged(ev: any) {
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
    this.modificarVista(true, true, false);
    this.verDetalleEcheq(false, false, false);
  }

  mostrarMenu(i: number){
    // this.echeq = this.vistaEcheqs[i];
    this.setEcheqVista(i);
    switch (this.echeq.datosEcheq.estadoEcheq){
      case ('Emitido - Pendiente'):
        this.menuEmitidos();
        break;
      case ('Activo'):
        this.menuActivos();
        break;
      case ('Rechazado'):
        this.menuRechazados();
        break;
      case ('Acuerdo Pendiente'):
        this.menuAcordados();
        break;
      case ('Devolucion Pendiente'):
        this.menuDevueltos();
        break;
    }
  }

  private setEcheqVista(i: number){
    this.echeq = this.vistaEcheqs[i];
    const idx = this.echeq.datosEcheq.endososEcheq.length - 1;
    this.tenedor = this.echeq.datosEcheq.endososEcheq[idx].endosatario;
  }

  async menuEmitidos(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta echeq');
        },
      }, {
        text: 'Anular Echeq ',
        icon: 'trash-outline',
        handler: () => {
          this.confirmarModificarEcheq('anular', 10);
        },
      }
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async menuActivos(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta echeq');
        },
      }, {
        text: 'Solicitar Devolucion',
        icon: 'arrow-undo-outline',
        handler: () => {
          this.comprobarEndosos();
        },
      }
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async menuRechazados(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        role: 'destructive',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheqCAC(this.echeq, 'Constancia de consulta echeq');
        },
      }, {
        text: 'Solicitar Acuerdo',
        role: 'destructive',
        icon: 'arrow-undo-circle-outline',
        handler: () => {
          this.solicitarAcuerdo();
        },
      }
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async menuAcordados(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        role: 'destructive',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheqCAC(this.echeq, 'Constancia de consulta echeq');
        },
      }, {
        text: 'Anular Acuerdo',
        role: 'destructive',
        icon: 'close-circle-outline',
        handler: () => {
          this.confirmarModificarEcheq('anular acuerdo', 8);
        },
      }
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  async menuDevueltos(): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        role: 'destructive',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta echeq');
        },
      }, {
        text: 'Anular Pedido Devolución',
        role: 'destructive',
        icon: 'arrow-redo-outline',
        handler: () => {
          this.confirmarModificarEcheq('anular devolución', 2);
        },
      }
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
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
    this.echeqs = this.user.buscarEcheqCoelsa(this.sesion.cuil);
    setTimeout( () => {
      this.filtrarEcheqs('Emitido - Pendiente');
      this.arrayVacio();
    }, 2000);
  }

  private filtrarEcheqs(estado: string){
    this.vistaEcheqs = [];
    console.log(this.echeqs.length);
    switch (estado){
      case ('Emitido - Pendiente'):
        Object.values(this.echeqs).forEach ( echeq => {
          if ( echeq.datosEcheq.estadoEcheq === estado || echeq.datosEcheq.estadoEcheq === 'Activo'){
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
      default:
        Object.values(this.echeqs).forEach( echeq => {
          if (echeq.datosEcheq.estadoEcheq === estado){
            this.vistaEcheqs.push(echeq);
          }
        });
        break;
    }
    console.log(this.vistaEcheqs);
  }

  private arrayVacio(){
    if (this.vistaEcheqs.length < 1){
      this.vacio = true;
    }else{
      this.vacio = false;
    }
  }
  private modificarVista(verMenu: boolean, verListado: boolean, verEcheq: boolean){
    this.verMenu = verMenu;
    this.verListado = verListado;
    this.verEcheq = verEcheq;
  }

  private verDetalleEcheq(datosEcheq: boolean, datosCuenta: boolean, datosBeneficiario: boolean){
    this.datosEcheq = datosEcheq;
    this.datosCuenta = datosCuenta;
    this.datosBeneficiario = datosBeneficiario;
  }

  private solicitarAcuerdo(){
    const idx = this.echeq.datosEcheq.endososEcheq.length - 1;
    const ultEnd = this.echeq.datosEcheq.endososEcheq[idx];
    console.log(ultEnd);
    if (ultEnd.endosante.cuilBeneficiario === this.sesion.cuil){
      this.confirmarModificarEcheq('solicitar acuerdo', 13);
    }else{
      this.toast.mostrarToast('Opción no disponible', 'danger');
    }
  }


  private comprobarEndosos(){
    const idx = this.echeq.datosEcheq.endososEcheq.length - 1;
    const ultEnd = this.echeq.datosEcheq.endososEcheq[idx];
    console.log(ultEnd);
    if (ultEnd.endosante.cuilBeneficiario === this.sesion.cuil){
      this.confirmarModificarEcheq('solicitar devolucion', 12);
    }else{
      this.toast.mostrarToast('Opción no disponible', 'danger');
    }
  }

  private async solicitarPassword(accion: string, estado: number){
    console.log('Anulando Echeq');
    await this.pass.verificarPass(this.sesion.cuil).then( (resp) => {
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
         this.solicitarModificarEcheq(accion, estado);
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
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


  private solicitarModificarEcheq(accion: string, estado: number){
    this.user.accionEcheqCoelsa(this.echeq, estado).then( () => {
      this.buscarEcheqs();
      this.toast.mostrarToast(`Echeq modificado!`, 'primary');
      if (accion === 'solicitar acuerdo' || accion === 'anular acuerdo'){
        this.cmprbte.comprobanteEcheqCAC(this.echeq, `Constancia por ${accion} echeq`);
      }else{
        this.cmprbte.comprobanteEcheq(this.echeq, `Constancia por ${accion} echeq`);
      }
      this.navCtrl.navigateBack('/tab/crearEcheq/sector-mis-echeq/3');
      setTimeout( () => {
        this.user.generarAlerta(accion, this.echeq);
      }, 1500);
    }).catch( (err) => {
      this.toast.mostrarToast('Error en BD!', 'danger');
    });
  }
}
