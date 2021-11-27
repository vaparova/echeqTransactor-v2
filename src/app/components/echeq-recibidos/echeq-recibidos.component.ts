import { Component, OnInit } from '@angular/core';
import { DatosSesion } from 'src/app/models/datosSesion';
import { DatosUsuario } from 'src/app/models/datosUsuario';
import { DatosCoelsa } from '../../models/datosCoelsa';
import { UsuariosService } from '../../providers/usuarios.service';
import { ToastsService } from '../../providers/toasts.service';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { ComprobantesServiceService } from '../../providers/comprobantes-service.service';
import { VerificarPasswordService } from '../../providers/verificar-password.service';

@Component({
  selector: 'app-echeq-recibidos',
  templateUrl: './echeq-recibidos.component.html',
  styleUrls: ['./echeq-recibidos.component.scss'],
})
export class EcheqRecibidosComponent implements OnInit {

  sesion: DatosSesion;
  usuario: DatosUsuario;
  vacio = false;
  echeqs: DatosCoelsa[] = [];
  vistaEcheqs: DatosCoelsa[] = [];
  echeq: DatosCoelsa;
  estado = 'Emitido - Pendiente';
  accion: string;
  verMenu = true;
  verListado = true;
  verEcheq = false;
  verCuentasDeposito = false;
  datosEcheq = false;
  datosCuenta = false;
  datosBeneficiario = false;


  constructor(private user: UsuariosService,
              private toast: ToastsService,
              private navCtrl: NavController,
              public actionSheetController: ActionSheetController,
              private cmprbte: ComprobantesServiceService,
              private pass: VerificarPasswordService,
              private alertController: AlertController
              ) { }

  ngOnInit() {
    this.obtenerData();
    this.buscarEcheqs();
  }


  presentActionSheet(i){
    console.log('algo');
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

  mostrarMenu(i: number){
    this.echeq = this.vistaEcheqs[i];
    switch (this.echeq.datosEcheq.estadoEcheq){
      case ('Emitido - Pendiente'):
        this.menuEmitidos(i);
        break;
      case ('Activo'):
        this.menuActivos(i);
        break;
      case ('Devolucion Pendiente'):
        this.menuDevueltos(i);
        break;
    }
  }

  volver(){
    this.modificarVista(true, true, false, false);
    this.verDetalleEcheq(false, false, false);
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

  async menuEmitidos(i: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true, false);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        icon: 'cloud-download-outline',
        handler: () => {
          this.echeq = this.vistaEcheqs[i];
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta echeq');
        },
      }, {
        text: 'Recibir Echeq',
        icon: 'mail-unread-outline',
        handler: () => {
          this.echeq = this.vistaEcheqs[i];
          this.confirmarModificarEcheq('recibir', 2);

        },
      }, {
        text: 'Repudiar Echeq',
        role: 'destructive',
        icon: 'trash-outline',
        handler: () => {
          this.echeq = this.vistaEcheqs[i];
          this.confirmarModificarEcheq('repudiar', 9);
        },
      }
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async menuDevueltos(i: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true, false);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        role: 'destructive',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta Echeq');
        },
      }, {
        text: 'Aceptar Pedido Devolución',
        role: 'destructive',
        icon: 'thumbs-up-outline',
        handler: () => {
          this.confirmarModificarEcheq('aceptar devolución', 10);
        }
      }, {
        text: 'Anular Pedido Devolución',
        role: 'destructive',
        icon: 'thumbs-down-outline',
        handler: () => {
          this.confirmarModificarEcheq('anular devolución', 2);
        }
      },
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async menuActivos(i: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true, false);
          this.verDetalleEcheq(true, false, false);
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        role: 'destructive',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta Echeq');
        },
      }, {
        text: 'Enviar a Custodia',
        icon: 'calendar-outline',
        handler: () => {
          this.accion = 'Enviar a Custodia';
          this.modificarVista(false, false, false, true);
        },
      }, {
        text: 'Endosar',
        icon: 'paper-plane-outline',
        handler: () => {

        },
      }, {
        text: 'Depositar',
        icon: 'cash',
        handler: () => {
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta Echeq');
        },
      },
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private verDetalleEcheq(datosEcheq: boolean, datosCuenta: boolean, datosBeneficiario: boolean){
    this.datosEcheq = datosEcheq;
    this.datosCuenta = datosCuenta;
    this.datosBeneficiario = datosBeneficiario;
  }

  private modificarVista(verMenu: boolean, verListado: boolean, verEcheq: boolean, verCtasDep: boolean){
    this.verMenu = verMenu;
    this.verListado = verListado;
    this.verEcheq = verEcheq;
    this.verCuentasDeposito = verCtasDep;
  }

  private buscarEcheqs(){
    this.echeqs = [];
    this.echeqs = this.user.buscarEcheqCoelsaBeneficiario(this.sesion.cuil);
    setTimeout( () => {
      this.filtrarEcheqs('Emitido - Pendiente');
      this.arrayVacio();
    }, 2000);
  }

  private filtrarEcheqs(estado: string){
    this.vistaEcheqs = [];
    console.log(this.echeqs.length);
    if (estado === 'Emitido - Pendiente'){
      Object.values(this.echeqs).forEach ( echeq => {
        if ( echeq.datosEcheq.estadoEcheq === estado || echeq.datosEcheq.estadoEcheq === 'Devolucion Pendiente'){
          this.vistaEcheqs.push(echeq);
        }
      });
    }else{
      Object.values(this.echeqs).forEach( echeq => {
        if (echeq.datosEcheq.estadoEcheq === estado){
          this.vistaEcheqs.push(echeq);
        }
      });
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
            this.solicitarModificarEcheq(accion, estado);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  private async solicitarModificarEcheq(accion: string, estado: number): Promise<void>{
    await this.pass.verificarPass(this.sesion.cuil).then( (resp) => {
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
         this.modEcheq(accion, estado);
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
  }

  private arrayVacio(){
    console.log(this.vistaEcheqs.length);
    if (this.vistaEcheqs.length < 1){
      this.vacio = true;
    }else{
      this.vacio = false;
    }
  }

  private modEcheq(accion: string, estado: number){
    this.user.accionEcheqCoelsa(this.echeq, estado).then( () => {
      this.buscarEcheqs();
      this.toast.mostrarToast(`Echeq modificado!`, 'primary');
      this.cmprbte.comprobanteEcheq(this.echeq, `Constancia por ${accion} echeq`);
    }).catch( (err) => {
      this.toast.mostrarToast('Error en BD!', 'danger');
    });
  }

}
