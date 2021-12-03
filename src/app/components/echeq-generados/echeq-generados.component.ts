import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AlertasService } from 'src/app/providers/alertas.service';
import { SpinnerService } from 'src/app/providers/spinner.service';
import { ToastsService } from 'src/app/providers/toasts.service';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { VerificarPasswordService } from 'src/app/providers/verificar-password.service';
import { DatosSesion } from '../../models/datosSesion';
import { DatosUsuario } from '../../models/datosUsuario';
import { ActionSheetController } from '@ionic/angular';
import { VerificarTokenService } from '../../providers/verificar-token.service';
import { DatosBeneficiario } from '../../models/datosBeneficiario';
import { DatosEndoso } from '../../models/datosEndoso';


@Component({
  selector: 'app-echeq-generados',
  templateUrl: './echeq-generados.component.html',
  styleUrls: ['./echeq-generados.component.scss'],
})
export class EcheqGeneradosComponent implements OnInit {
  sesion: DatosSesion;
  usuario: DatosUsuario;
  formaEcheq: FormGroup;
  echeqs: any[] = [];
  echeq: any;
  vacio = false;
  secEcheq = true;
  verEcheq = false;
  libEcheq = false;
  editEcheq = false;
  datosEcheq = true;
  datosCuenta = false;
  datosBeneficiario = false;
  state = {
    importe: '',
    pago: '',
    motivo: '',
    referencia: ''
  };
  motivos = [
    {codigo: 'ALQ', detalle: 'Alquileres'},
    {codigo: 'CUO', detalle: 'Cuotas'},
    {codigo: 'EXP', detalle: 'Expensas'},
    {codigo: 'FAC', detalle: 'Facturas'},
    {codigo: 'PRE', detalle: 'Préstamos'},
    {codigo: 'SEG', detalle: 'Seguros'},
    {codigo: 'HON', detalle: 'Honorarios'},
    {codigo: 'HAB', detalle: 'Haberes'},
    {codigo: 'VAR', detalle: 'Varios'}
  ];


  constructor(
    private user: UsuariosService,
    private toast: ToastsService,
    private spinner: SpinnerService,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private passw: VerificarPasswordService,
    private alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private tkn: VerificarTokenService
    ) {
      this.obtenerData();
      this.obtenerEcheqs();
      console.log(this.echeqs);

   }

  ngOnInit() {}

  segmentChanged(ev: any) {
    console.log('Segment changed', ev, ev.detail.value );
    switch (ev.detail.value) {
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

  resetState(): void{
    this.state.importe = '';
    this.state.pago = '';
    this.state.motivo = '';
    this.state.referencia = '';
  }

  volver(): void{
    this.modificarVista(true, false, false, false);
  }

  async modificar(): Promise <void>{
    await this.passw.verificarPass(this.sesion.cuil).then(resp => {
      console.log(resp);
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
          this.modificarEcheq();
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
  }

  async presentActionSheet(i: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      // header: 'Acciones',
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, true, false, false);
          this.echeq = this.echeqs[i];
          console.log(this.echeq);
        }
      }, {
        text: 'Editar',
        icon: 'pencil-outline',
        handler: () => {
          this.echeq = this.echeqs[i];
          this.crearFormaEcheq();
          this.setFormaEcheq();
          this.modificarVista(false, false, false, true);
          console.log(this.echeq);
        }
      }, {
        text: 'Librar',
        icon: 'send-outline',
        handler: () => {
          this.echeq = this.echeqs[i];
          // console.log(this.echeq);
          this.librarEcheq();
          // this.tkn.pedirToken(this.sesion.cuil);
        }
      }, {
        text: 'Eliminar',
        role: 'destructive',
        icon: 'trash-outline',
        handler: () => {
          this.echeq = this.echeqs[i];
          this.confirmarBorrar();
          console.log('Delete clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private async confirmarBorrar(): Promise<void> {
    const title = `Eliminar Echeq Nº ${this.echeq.echeq.nroEcheq}`;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: title,
      message: '¿Estas seguro de eliminar este Echeq?',
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
            this.eliminarEcheq();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
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

  private obtenerEcheqs(): void{
    this.echeqs = this.user.getEcheqGenerados(this.usuario.usuario.datosPersonales.cuil);
    if (this.echeqs.length < 1){
      this.vacio = true;
    }
  }

  private modificarVista(secEcheq: boolean, verEcheq: boolean, libEcheq: boolean, editEcheq: boolean): void{
    this.secEcheq = secEcheq;
    this.verEcheq = verEcheq;
    this.libEcheq = libEcheq;
    this.editEcheq = editEcheq;
  }

  private verDetalleEcheq(datosEcheq: boolean, datosCuenta: boolean, datosBeneficiario: boolean){
    this.datosEcheq = datosEcheq;
    this.datosCuenta = datosCuenta;
    this.datosBeneficiario = datosBeneficiario;
  }

  private crearFormaEcheq(): void{
    this.formaEcheq = this.fb.group({
      importe: ['', [Validators.required, Validators.minLength(2)]],
      pago: ['',  [Validators.required, Validators.minLength(4)]],
      motivo: ['', [Validators.required, Validators.minLength(3)]],
      referencia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]]
    });
  }

  private setFormaEcheq(): void{
    this.formaEcheq.reset({
      importe: this.echeq.echeq.montoEcheq,
      pago: this.echeq.echeq.fechaPago,
      motivo: this.echeq.echeq.motivo,
      referencia: this.echeq.echeq.referencia
    });
  }

  private verificarFormEcheq(): boolean{
    if (this.formaEcheq.invalid){
      this.toast.mostrarToast('Formulario Erróneo', 'danger');
      return false;
    }
    return true;
  }

  private setEcheq(): void{
    this.echeq.echeq.montoEcheq = this.formaEcheq.controls.importe.value;
    this.echeq.echeq.fechaPago = this.formaEcheq.controls.pago.value;
    this.echeq.echeq.motivo = this.formaEcheq.controls.motivo.value;
    this.echeq.echeq.referencia = this.formaEcheq.controls.referencia.value;
  }

  private modificarEcheq(): void{
    if (this.verificarFormEcheq()){
      this.setEcheq();
      const resp = this.user.modificarEcheq(this.sesion.cuil, this.echeq.cta, this.echeq.cheq, this.echeq.echeq);
      resp.then( () => {
        this.toast.mostrarToast('Echeq Modificado!', 'primary');
        this.modificarVista(true, false, false, false);
      }).catch( () => {
        this.toast.mostrarToast('Error BD!', 'danger');
      });
    }
  }

  private eliminarEcheq(): void{
    const resp = this.user.eliminarEcheq(this.sesion.cuil, this.echeq.cta, this.echeq.cheq, this.echeq.echeq.nroEcheq);
    resp.then( () => {
      this.obtenerEcheqs();
      this.toast.mostrarToast('Echeq Eliminado!', 'primary');
      this.modificarVista(true, false, false, false);
    }).catch( () => {
      this.toast.mostrarToast('Error BD!', 'danger');
    });
  }

  private async librarEcheq(): Promise<void>{
    console.log(this.echeq.echeq.fechaEmision);
    return await this.tkn.pedirToken(this.sesion.cuil).then( (tkn) => {
      console.log('Estuvo todo ok, ya se puede librar');
      this.crearEndosoLibrador();
      return this.user.librarEcheq(this.sesion.cuil, this.echeq.ent, this.echeq.cta, this.echeq.cheq, this.echeq.echeq);
    }).then( () => {
      this.obtenerEcheqs();
      this.user.generarAlerta('echeq librado', this.echeq);
      this.toast.mostrarToast('Echeq librado', 'primary');
      this.navCtrl.navigateBack('/tab/crearEcheq/sector-mis-echeq/3');
    }).catch( (err) => {
      console.log('Hubo un error o se canceló la operación');
      this.toast.mostrarToast('Error enb DB!', 'danger');
    });
  }

  private crearEndosoLibrador(){
    this.echeq.echeq.endososEcheq = [];
    const endosante = new DatosBeneficiario(this.sesion.cuil, this.echeq.cta.denominacion);
    const endosatario = new DatosBeneficiario(
      this.echeq.echeq.beneficiario.cuilBeneficiario,
      this.echeq.echeq.beneficiario.nombreBeneficiario);
    this.echeq.echeq.endososEcheq.push(this.setEndoso(endosante, endosatario));
  }

  private crearEndosoDev(){
    const endosatario = new DatosBeneficiario(this.sesion.cuil, this.echeq.cta.denominacion);
    const endosante = new DatosBeneficiario(
      this.echeq.echeq.beneficiario.cuilBeneficiario,
      this.echeq.echeq.beneficiario.nombreBeneficiario);
    this.echeq.echeq.endososEcheq.push(this.setEndoso(endosante, endosatario));
  }

  private setEndoso(endosante: DatosBeneficiario, endosatario: DatosBeneficiario): DatosEndoso{
    return new DatosEndoso(endosante, endosatario);
  }
}
