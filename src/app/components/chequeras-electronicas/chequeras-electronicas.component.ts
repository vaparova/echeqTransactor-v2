import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { DatosChequeras } from '../../models/datosChequeras';
import { DatosCuentas } from '../../models/datosCuentas';
import { VerificarClaveService } from '../../providers/verificar-clave.service';
import { ToastsService } from '../../providers/toasts.service';
import { SpinnerService } from '../../providers/spinner.service';
import { NavController, AlertController } from '@ionic/angular';
import { DatosSesion } from '../../models/datosSesion';
import { VerificarPasswordService } from '../../providers/verificar-password.service';
import { DatosCuenta } from '../../models/datosCuenta';



@Component({
  selector: 'app-chequeras-electronicas',
  templateUrl: './chequeras-electronicas.component.html',
  styleUrls: ['./chequeras-electronicas.component.scss'],
})
export class ChequerasElectronicasComponent implements OnInit {
  usuario: DatosUsuario;
  cuentas: DatosCuentas [];
  chequeras = [];
  sinChequeras = false;
  sesion: DatosSesion;


  constructor(private user: UsuariosService,
              private verifClave: VerificarClaveService,
              private toast: ToastsService,
              private spinner: SpinnerService,
              private navCtrl: NavController,
              private passw: VerificarPasswordService,
              private alertController: AlertController
              ) {

    this.obtenerData();
    this.user.agregarTiempo();
    this.cuentas = this.usuario.usuario.datosCuentas;
    this.obtenerChequeras(this.cuentas);
    if (this.chequeras.length === 0){
      this.sinChequeras = true;
    }
    console.log(this.chequeras);
  }

  ngOnInit() {
  }

  nuevaChequera(){
    this.navCtrl.navigateBack(`/tab/miCuenta/sector-mi-cuenta/6`);
  }

  async activar(i: number){
    const clave = this.chequeras[i].cheq.codigoActivacion;
    const resp = await this.verifClave.ingresarClaveActivación(clave);
    const cta: DatosCuenta = this.chequeras[i].cta;
    const cuenta = this.buscarCta(cta.cbu);

    console.log(resp);
    if (!resp.data.resp){
      this.toast.mostrarToast(resp.data.arg, 'danger');
      return;
    }else{
      this.spinner.presentLoading();
      this.toast.mostrarToast(resp.data.arg, 'primary');
      setTimeout(() => {
        this.modificarUsuario(
          'activar',
          this.sesion.cuil,
          cuenta,
          this.buscarIndexCheq(cta.cbu, false)
        );
      }, 3000);
    }
  }

  async cancelarPedido(i: number){
    const cuenta: DatosCuenta = this.chequeras[i].cta;
    const idx = this.buscarIndexCta(cuenta.cbu);
    const alerta = await this.alertaCancelarPedido();
    console.log(alerta.data.resp);

    if (alerta.data.resp){
      const pass = await this.passw.verificarPass(this.sesion.cuil).then(resp => {
        console.log(resp);
        if (resp.data.respuesta){
          this.toast.mostrarToast(resp.data.argumento, 'primary');
          setTimeout( () => {
            this.modificarUsuario(
              'cancelar',
              this.sesion.cuil,
              this.cuentas[idx]
            );
          }, 2000);
        }else{
          this.toast.mostrarToast(resp.data.argumento, 'danger');
        }
      });
    }else{
      this.toast.mostrarToast(alerta.data.arg, 'danger');
    }
  }

  aprobarPedido(i: number): void{
    const cta: DatosCuenta = this.chequeras[i].cta;
    console.log(this.usuario.usuario.datosCuentas[this.buscarIndexCta(cta.cbu)]);
    console.log(this.buscarIndexCheq(cta.cbu, false));
    this.spinner.presentLoading();
    setTimeout(() => {
      this.modificarUsuario(
        'aprobar',
        this.sesion.cuil,
        this.usuario.usuario.datosCuentas[this.buscarIndexCta(cta.cbu)],
        this.buscarIndexCheq(cta.cbu, false)
        );
    }, 2000);
  }

  private async alertaCancelarPedido() {
    const alert = await this.alertController.create({
      header: 'Cancelar Pedido',
      message: 'Se eliminará tu pedido de chequera, ¿Estás Seguro?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            const rp = {  resp: false,
                arg: 'Operacion cancelada!'};
            return rp;
            }
          }, {
            text: 'Ok',
            handler: () => {
              const rp = {  resp: true,
                arg: 'Operacion confirmada!'};
              return rp;
          }
        }
      ]
    });

    await alert.present();
    const response = await alert.onDidDismiss();
    return response;
  }

  private buscarCta(cbu: string): DatosCuentas{
    return this.cuentas.find( resp => resp.cuentas.cuenta.cbu === cbu);
  }

  private buscarIndexCta(cbu: string): number{
    const cuenta = this.cuentas.find( resp => resp.cuentas.cuenta.cbu === cbu);
    return this.cuentas.indexOf(cuenta);
  }

  private buscarIndexCheq(cbu: string, estado: boolean): number{
    const idx = this.buscarIndexCta(cbu);
    console.log(`index de la cuenta: ${idx}`);
    const cheq = this.usuario.usuario.datosCuentas[idx].cuentas.chequeras.find( resp => resp.estadoChequera === estado );
    console.log(cheq);
    return this.usuario.usuario.datosCuentas[idx].cuentas.chequeras.indexOf(cheq);
  }

  private obtenerData(){
    const a = this.user.validarSesion();
    if (a){
      this.sesion = a;
      this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
      console.log(`respta obtenerUsuario() US: ${this.usuario}`);
    }else{
      this.user.borrarSesion();
      this.toast.mostrarToast('Debes iniciar sesión', 'danger');
      this.navCtrl.navigateBack('/ingreso');
      console.log('error de login!');
    }
  }

  private obtenerChequeras(cuentas: DatosCuentas[]){
    if (cuentas){
      cuentas.forEach(resp => {
        if (resp.cuentas.chequeras){
          resp.cuentas.chequeras.forEach((chequera: DatosChequeras) => {
            const obj = { cta: resp.cuentas.cuenta,
                          ent: resp.cuentas.entidad,
                          cheq: chequera};
            return this.chequeras.push(obj);
          });
        }
      });
    }
  }

  private actualizarLista(): void{
    this.chequeras = [];
    this.cuentas = [];
    console.log('actualizando lista...');
    console.log(this.user.getArrCuentas(this.user.obtenerUsuario(this.sesion.cuil)));
    this.cuentas = this.user.getArrCuentas(this.user.obtenerUsuario(this.sesion.cuil));
    this.obtenerChequeras(this.user.getArrCuentas(this.user.obtenerUsuario(this.sesion.cuil)));
  }

  private modificarUsuario(accion: string, cuil: number, cuenta: DatosCuentas, idx?: number): void{
    switch (accion){
      case('activar'): {
        this.user.activarChequeraElectronica(cuenta, idx, cuil).then( () => {
          this.toast.mostrarToast('Has activado tu chequera!', 'primary');
          console.log(this.usuario);
          this.actualizarLista();
        }).catch ( () => {
          this.navCtrl.navigateBack('/tab/miCuenta');
          this.toast.mostrarToast('Error en BD!', 'danger');
        });
        break;
      }
      case('cancelar'): {
        this.user.cancelarPedidoChequera(cuenta, cuil).then( () => {
          this.toast.mostrarToast('Pedido Eliminado!', 'primary');
          this.actualizarLista();
          console.log(this.usuario);
        }).catch ( () => {
          this.navCtrl.navigateBack('/tab/miCuenta');
          this.toast.mostrarToast(`Error en BD!`, 'danger');
        });
        break;
      }
      case('aprobar'): {
        this.user.aprobarPedidoChequera(cuenta, cuil, idx).then( () => {
          this.toast.mostrarToast('Pedido Aprobado!', 'primary');
          this.actualizarLista();
          console.log(this.usuario);
        }).catch ( () => {
          this.navCtrl.navigateBack('/tab/miCuenta');
          this.toast.mostrarToast(`Error en BD!`, 'danger');
        });
        break;
      }
    }
  }
}
