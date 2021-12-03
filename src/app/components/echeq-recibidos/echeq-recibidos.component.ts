import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatosSesion } from 'src/app/models/datosSesion';
import { DatosUsuario } from 'src/app/models/datosUsuario';
import { DatosCoelsa } from '../../models/datosCoelsa';
import { UsuariosService } from '../../providers/usuarios.service';
import { ToastsService } from '../../providers/toasts.service';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { ComprobantesServiceService } from '../../providers/comprobantes-service.service';
import { VerificarPasswordService } from '../../providers/verificar-password.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosCuentas } from 'src/app/models/datosCuentas';
import { DatosBeneficiario } from '../../models/datosBeneficiario';
import { DatosEndoso } from '../../models/datosEndoso';


@Component({
  selector: 'app-echeq-recibidos',
  templateUrl: './echeq-recibidos.component.html',
  styleUrls: ['./echeq-recibidos.component.scss'],
})
export class EcheqRecibidosComponent implements OnInit, OnDestroy {

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
  state = {
    denominacion: '',
    cuil: ''
  };


  constructor(private user: UsuariosService,
              private toast: ToastsService,
              private navCtrl: NavController,
              public actionSheetController: ActionSheetController,
              private cmprbte: ComprobantesServiceService,
              private pass: VerificarPasswordService,
              private alertController: AlertController,
              private fb: FormBuilder,
              ) { }

  ngOnInit(): void {
    this.obtenerData();
    this.buscarEcheqs();
  }

  ngOnDestroy(): void{
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

  presentActionSheet(i): void{
    console.log('algo');
  }

  segmentChanged(ev: any): void{
    console.log('algo');
    const estado = ev.detail.value.toString();
    this.estado = estado;
    this.filtrarEcheqs(estado);
    this.arrayVacio();
  }

  resetState(): void{
    this.state.denominacion = '';
    this.state.cuil = '';
  }


  detalleEcheq(ev: any): void{
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

  mostrarMenu(i: number): void{
    // this.echeq = this.vistaEcheqs[i];
    this.setEcheqVista(i);
    switch (this.echeq.datosEcheq.estadoEcheq){
      case ('Emitido - Pendiente'):
      case ('Activo - Pendiente'):
        this.menuEmitidos(i);
        break;
      case ('Activo'):
        this.menuActivos(i);
        break;
      case ('Devolucion Pendiente'):
        this.menuDevueltos(i);
        break;
      case ('Custodia'):
        this.menuCustodia(i);
        break;
    }
  }

  volver(): void{
    this.modificarVista(true, true, false, false, false);
    this.verDetalleEcheq(false, false, false);
  }

  depositoCta(accion: string): void{
    console.log(accion);
    console.log(this.formaCtas);
    if (!this.formaCtas.invalid){
      this.cta = this.formaCtas.controls.cuenta.value;
      if (accion === 'Depositar'){
        this.confirmarModificarEcheq('depositar', 6);
      }else{
        this.confirmarModificarEcheq('enviar a custiodia', 3);
      }
    }else{
      this.toast.mostrarToast('Error en formulario!', 'danger');
    }
  }

  crearEndoso(): void{
    if (!this.formaBenef.invalid){
      this.confirmarModificarEcheq('endosar', 4);
    }else{
      this.errorFormaBenef();
      this.toast.mostrarToast('Error en formulario', 'danger');
    }
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
      }, {
        text: 'Recibir Echeq',
        icon: 'mail-unread-outline',
        handler: () => {
         // this.echeq = this.vistaEcheqs[i];
          this.setEcheqVista(i);
          this.confirmarModificarEcheq('recibir', 2);

        },
      }, {
        text: 'Repudiar Echeq',
        role: 'destructive',
        icon: 'trash-outline',
        handler: () => {
          // this.echeq = this.vistaEcheqs[i];
          this.setEcheqVista(i);
          this.repudiarEcheq();
          // this.confirmarModificarEcheq('repudiar', 9);
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
          this.aceptarDevolucion();
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
        role: 'destructive',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta Echeq');
        },
      }, {
        text: 'Enviar a Custodia',
        role: 'destructive',
        icon: 'calendar-outline',
        handler: () => {
          this.accion = 'Custodiar';
          (this.verificarFechaEcheq('Custodiar')) ? this.comprobarCtas() : this.toast.mostrarToast('Acción no disponible', 'danger');
        },
      }, {
        text: 'Endosar',
        icon: 'paper-plane-outline',
        handler: () => {
          this.accion = 'Endosar';
          this.crerFormaBenef();
          this.modificarVista(false, false, false, false, true);

        },
      }, {
        text: 'Depositar',
        icon: 'cash',
        handler: () => {
          this.accion = 'Depositar';
          (this.verificarFechaEcheq('Depositar')) ?
          this.comprobarCtas() : this.toast.mostrarToast('Acción no disponible', 'danger');
        },
      },
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async menuCustodia(i: number): Promise<void> {
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
        role: 'destructive',
        icon: 'cloud-download-outline',
        handler: () => {
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de consulta Echeq');
        },
      }, {
        text: 'Rescatar',
        role: 'destructive',
        icon: 'folder-open-outline',
        handler: () => {
          this.accion = 'Rescatar';
          (this.verificarFechaEcheq('Rescatar')) ?  this.confirmarModificarEcheq('rescate', 2) : this.toast.mostrarToast('Acción no disponible', 'danger');
          // Hay que verificar la fecha de pago, hasta un día antes para rescatar
        },
      },
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private setEcheqVista(i: number): void{
    this.echeq = this.vistaEcheqs[i];
    const idx = this.echeq.datosEcheq.endososEcheq.length - 1;
    this.tenedor = this.echeq.datosEcheq.endososEcheq[idx].endosatario;
  }



  private verDetalleEcheq(datosEcheq: boolean, datosCuenta: boolean, datosBeneficiario: boolean): void{
    this.datosEcheq = datosEcheq;
    this.datosCuenta = datosCuenta;
    this.datosBeneficiario = datosBeneficiario;
  }

  private modificarVista(verMenu: boolean, verListado: boolean, verEcheq: boolean, verCtasDep: boolean, verEndoso: boolean): void{
    this.verMenu = verMenu;
    this.verListado = verListado;
    this.verEcheq = verEcheq;
    this.verCuentasDeposito = verCtasDep;
    this.verEndoso = verEndoso;
  }

  private buscarEcheqs(): void{
    this.echeqs = [];
    this.echeqs = this.user.buscarEcheqCoelsaBeneficiario(this.sesion.cuil);
    setTimeout( () => {
      this.filtrarEcheqs('Emitido - Pendiente');
      this.arrayVacio();
    }, 2000);
  }

  private filtrarEcheqs(estado: string): void{
    this.vistaEcheqs = [];
    console.log(this.echeqs.length);
    if (estado === 'Emitido - Pendiente'){
      Object.values(this.echeqs).forEach ( echeq => {
        if ( echeq.datosEcheq.estadoEcheq === estado || echeq.datosEcheq.estadoEcheq === 'Devolucion Pendiente' ||
        echeq.datosEcheq.estadoEcheq === 'Activo - Pendiente' ){
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
    console.log(this.vistaEcheqs);
  }

  private repudiarEcheq(): void{
    const idx = this.echeq.datosEcheq.endososEcheq.length;
    switch (true){
      case (idx > 1):
        this.confirmarModificarEcheq('repudiar', 2);
        this.elimEndoso();
        break;
      case (idx === 1):
        this.confirmarModificarEcheq('repudiar', 9);
        break;
    }
  }

  private aceptarDevolucion(): void{
    const idx = this.echeq.datosEcheq.endososEcheq.length;
    switch (true){
      case (idx > 1):
        this.confirmarModificarEcheq('aceptar devolución', 2);
        this.elimEndoso();
        break;
      case (idx === 1):
        this.confirmarModificarEcheq('aceptar devolución', 10);
        break;
    }
  }

  private comprobarCtas(): void{
    this.setCtasDep();
    this.crearFormaCta();
    if (this.usuario.usuario.datosCuentas) {
      this.sinCuentas = true;
    }
    this.modificarVista(false, false, false, true, false);
  }

  private setCtasDep(): void{
    if (this.usuario.usuario.datosCuentas){
      Object.values(this.usuario.usuario.datosCuentas).forEach( (cuentas) => {
        if (cuentas.cuentas.cuenta.cbu !== this.echeq.datosCuenta.cbu){
          this.listaEntidades.push(cuentas);
        }
      });
    }
  }

  private setEndoso(endosante: DatosBeneficiario, endosatario: DatosBeneficiario): DatosEndoso{
    return new DatosEndoso(endosante, endosatario);
  }

  private elimEndoso(): void{
    this.echeq.datosEcheq.endososEcheq.pop();
  }

  private verificarFechaEcheq(accion: string): boolean{
    const dif = this.restarFechas(new Date(), this.convertirFechaEcheq());
    switch (accion){
      case 'Custodiar':
      case 'Rescatar':
        return (dif > 0) ? true : false;
      case 'Depositar':
        return (dif < 0) ? true : false;
    }
  }

  private restarFechas(fc: Date, fg: Date): number{
    const c = fc.getTime();
    const g = fg.getTime();
    const dif = g - c;
    console.log(dif);
    const days = dif / (1000 * 3600 * 24 );
    console.log(`Diferencia entre fechas ${days}`);
    return days;
  }

  private convertirFechaEcheq(): Date{
    let e = this.echeq.datosEcheq.fechaPago.toString();
    e = e.replace(/-/g, ',');
    return new Date(e);
  }


  private crearFormaCta(): void{
    this.formaCtas = this.fb.group({
      cuenta: ['',  [Validators.required]],
    });
  }

  private crerFormaBenef(): void{
    this.formaBenef = this.fb.group({
      denominacion: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^([A-Z]{1}[a-z_]{2,} )+([A-Z]{1}[a-z]{2,})$')]],
      cuil: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    });
  }

  private errorFormaBenef(): void{
    if (this.formaBenef.controls.denominacion.invalid){
      this.state.denominacion = 'danger';
    }
    if (this.formaBenef.controls.cuil.invalid){
      this.state.cuil = 'danger';
    }
  }

  private async confirmarModificarEcheq(accion: string, estado: number): Promise<void> {
    const cap = accion.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    const title = `${cap} Echeq Nº ${this.echeq.datosEcheq.nroEcheq}`;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class2',
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

  private arrayVacio(): void{
    console.log(this.vistaEcheqs.length);
    if (this.vistaEcheqs.length < 1){
      this.vacio = true;
    }else{
      this.vacio = false;
    }
  }

  private crearNuevoEndoso(): void{
    const denominacion = this.usuario.usuario.datosPersonales.apellido + ' ' + this.usuario.usuario.datosPersonales.nombre;
    const endosante = new DatosBeneficiario(this.sesion.cuil, denominacion);
    const endosatario = new DatosBeneficiario(
      this.formaBenef.controls.cuil.value,
      this.formaBenef.controls.denominacion.value);
    const endoso = this.setEndoso(endosante, endosatario);
    console.log(endoso);
    this.echeq.datosEcheq.endososEcheq.push(endoso);
  }

  private setCtaEndosatario(cta: DatosCuentas): void{
    const idx = this.echeq.datosEcheq.endososEcheq.length - 1;
    const benef = new DatosBeneficiario(
      this.echeq.datosEcheq.endososEcheq[idx].endosatario.cuilBeneficiario,
      this.echeq.datosEcheq.endososEcheq[idx].endosatario.nombreBeneficiario
    );
    benef.datosCuenta = cta.cuentas.cuenta;
    benef.datosEntidad = cta.cuentas.entidad;
    console.log(benef);
    this.echeq.datosEcheq.endososEcheq[idx].endosatario = benef;
  }

  private rescatarEcheq(): void{
    const idx = this.echeq.datosEcheq.endososEcheq.length - 1;
    const benef = new DatosBeneficiario(
      this.echeq.datosEcheq.endososEcheq[idx].endosatario.cuilBeneficiario,
      this.echeq.datosEcheq.endososEcheq[idx].endosatario.nombreBeneficiario
    );
    this.echeq.datosEcheq.endososEcheq[idx].endosatario = benef;
  }

  private adecuacionesEcheq(accion: string): void{
    switch (accion){
      case 'rescate':
        this.rescatarEcheq();
        console.log('Eliminando último endoso');
        break;
      case 'endosar':
        this.crearNuevoEndoso();
        break;
      case 'enviar a custiodia':
      case 'depositar':
        this.setCtaEndosatario(this.formaCtas.controls.cuenta.value);
        this.cta = null;
        break;
    }
  }

  private modEcheq(accion: string, estado: number): void{
    this.adecuacionesEcheq(accion);
    this.user.accionEcheqCoelsa(this.echeq, estado).then( () => {
      this.buscarEcheqs();
      this.toast.mostrarToast(`Echeq modificado!`, 'primary');
      this.cmprbte.comprobanteEcheq(this.echeq, `Constancia por ${accion} echeq`);
      this.navCtrl.navigateBack('tab/echeqRecibidos/sector-echeq-recibidos/1');
      this.modificarVista(true, true, false, false, false);
    }).catch( (err) => {
      console.log(err);
      this.toast.mostrarToast('Error en BD!', 'danger');
    });
  }

}
