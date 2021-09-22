import { Component, OnInit, Input } from '@angular/core';
import { DatosChequeras } from '../../models/datosChequeras';
import { UsuariosService } from '../../providers/usuarios.service';
import { DatosUsuario } from '../../models/datosUsuario';
import { DatosSesion } from 'src/app/models/datosSesion';
import { ToastsService } from 'src/app/providers/toasts.service';
import { SpinnerService } from 'src/app/providers/spinner.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosBeneficiario } from '../../models/datosBeneficiario';
import { DatosEcheq } from '../../models/datosEcheq';
import { VerificarPasswordService } from '../../providers/verificar-password.service';
import { AlertasService } from '../../providers/alertas.service';


@Component({
  selector: 'app-nuevo-echeq',
  templateUrl: './nuevo-echeq.component.html',
  styleUrls: ['./nuevo-echeq.component.scss'],
})
export class NuevoEcheqComponent implements OnInit {

  @Input() index: string;
  usuario: DatosUsuario;
  sesion: DatosSesion;
  beneficiario: DatosBeneficiario;
  echeq: DatosEcheq;
  formaBenef: FormGroup;
  formaEcheq: FormGroup;
  cheqSeleccionada: any;
  arrChequeras = [];
  crearUno = true;
  crearDos = false;
  crearTres = false;
  crearCuatro = false;
  state = {
    denominacion: '',
    cuil: '',
    email: '',
    importe: '',
    emision: '',
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
    private alertas: AlertasService
    ) {
      this.obtenerData();
      this.obtenerChequeras(this.usuario);
   }

  ngOnInit() {}

  resetState(): void{
    this.state.denominacion = '';
    this.state.cuil = '';
    this.state.email = '';
    this.state.importe = '';
    this.state.emision = '';
    this.state.pago = '';
    this.state.motivo = '';
    this.state.referencia = '';
  }

  pasoDatosBeneficiario(i: number): void{
    this.cheqSeleccionada = this.arrChequeras[i];
    this.crearFormaBeneficiario();
    this.pasosCrearEcheq(false, true, false, false);
    console.log(this.cheqSeleccionada);
  }


  datosEcheq(): void{
    console.log(this.formaBenef);
    if (this.verificarFormBenef()){
      this.crearBeneficiario();
      this.crearFormaEcheq();
      this.pasosCrearEcheq(false, false, true, false);
      console.log(this.beneficiario);
    }
  }

  confirmarDatosEcheq(): void{
    console.log(this.formaEcheq);
    const resp = this.verificarFormEcheq ? this.verificarFechas() : false;
    if (!resp){
      this.toast.mostrarToast('Formulario inválido!', 'danger');
      return;
    }else{
      this.generarEcheq();
      this.pasosCrearEcheq(false, false, false, true);
    }
  }

  async confirmarEcheq(){
    const pass = await this.passw.verificarPass(this.sesion.cuil).then(resp => {
      console.log(resp);
      if (resp.data.respuesta){
        this.toast.mostrarToast(resp.data.argumento, 'primary');
        setTimeout( () => {
          this.crearEcheq();
        }, 2000);
      }else{
        this.toast.mostrarToast(resp.data.argumento, 'danger');
      }
    });
  }

  private obtenerChequeras(usuario: DatosUsuario): void{
    const arrCtas = this.user.getArrCuentas(usuario);
    arrCtas.forEach( resp => {
      if (resp.cuentas.chequeras){
        resp.cuentas.chequeras.forEach( chequera => {
          if (chequera.estadoChequera === true && chequera.estadoPedido === true){
            const obj = {
              cta: resp.cuentas.cuenta,
              ent: resp.cuentas.entidad,
              cheq: chequera
            };
            this.arrChequeras.push(obj);
          }
        });
      }
    });
    console.log(this.arrChequeras);
  }

  private obtenerData(){
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

  private pasosCrearEcheq(u: boolean, d: boolean, t: boolean, c: boolean): void{
    this.crearUno = u;
    this.crearDos = d;
    this.crearTres = t;
    this.crearCuatro = c;
  }

  private crearFormaBeneficiario(): void{
    this.formaBenef = this.fb.group({
      denominacion: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^([A-Z]{1}[a-z_]{2,} )+([A-Z]{1}[a-z]{2,})$')]],
      cuil: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
      email: ['', [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
    });
  }

  private crearFormaEcheq(): void{
    this.formaEcheq = this.fb.group({
      importe: ['', [Validators.required, Validators.minLength(2)]],
      pago: ['',  [Validators.required, Validators.minLength(4)]],
      motivo: ['', [Validators.required, Validators.minLength(3)]],
      referencia: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]]
    });
  }

  private verificarFormBenef(): boolean{
    if (this.formaBenef.invalid){
      this.errorFormaBenef();
      this.toast.mostrarToast('Formulario inválido!', 'danger');
      return false;
    }
    return true;
  }

  private verificarFormEcheq(): boolean{
    if (this.formaEcheq.invalid){
      this.errorFormaEcheq();
      return false;
    }
    return true;
  }

  private errorFormaBenef(): void{
    if (this.formaBenef.controls.denominacion.invalid){
      this.state.denominacion = 'danger';
    }
    if (this.formaBenef.controls.cuil.invalid){
      this.state.cuil = 'danger';
    }
    if (this.formaBenef.controls.email.invalid){
      this.state.email = 'danger';
    }
  }

  private errorFormaEcheq(): void{
    if (this.formaEcheq.controls.importe.invalid){
      this.state.importe = 'danger';
    }
    if (this.formaEcheq.controls.emision.invalid){
      this.state.emision = 'danger';
    }
    if (this.formaEcheq.controls.pago.invalid){
      this.state.pago = 'danger';
    }
    if (this.formaEcheq.controls.motivo.invalid){
      this.state.motivo = 'danger';
    }
    if (this.formaEcheq.controls.referencia.invalid){
      this.state.referencia = 'danger';
    }
  }

  private errorFechas(): void{
    this.state.emision = 'danger';
    this.state.pago = 'danger';
  }

  private crearBeneficiario(): void {
    this.beneficiario = new DatosBeneficiario(
      this.formaBenef.controls.cuil.value,
      this.formaBenef.controls.denominacion.value,
      this.formaBenef.controls.email.value
    );
  }

  private convertirFechaEcheq(campo: string): Date{
    let e = this.formaEcheq.get(campo).value;
    e = e.replace(/-/g, ',');
    return new Date(e);
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

  private verificarFechas(): boolean{
    const fechPago = this.convertirFechaEcheq('pago');
    const fechEmision = new Date();
    const dif = this.restarFechas(fechEmision, fechPago);

    const resp = (dif > 0 && dif < 365) ? true : false;
    console.log(`Respuesta verificar fechas: ${resp}`);
    if (!resp) {
      this.errorFechas();
    }
    return resp;

  }

  private generarEcheq(): void{
    this.echeq = new DatosEcheq(
      this.generarNroEcheq(),
      0,
      new Date(),
      this.formaEcheq.controls.pago.value,
      this.formaEcheq.controls.importe.value,
      this.formaEcheq.controls.motivo.value,
      this.formaEcheq.controls.referencia.value,
      this.beneficiario
    );
    console.log(this.echeq);
  }

  private generarNroEcheq(): number{
    return this.cheqSeleccionada.cheq.cantidadEcheq - this.cheqSeleccionada.cheq.cantidadDisponible + 1;
  }

  private crearEcheq(): void {
    const resp = this.user.crearEcheq(
      this.echeq,
      this.cheqSeleccionada.cheq.nroPrimerEcheq,
      this.cheqSeleccionada.cta.cbu,
      this.sesion.cuil
    );
    resp.then( () => {
      console.log('Se agregó correctamente el echeq');
      this.toast.mostrarToast('Se creó exitosamente el echeq', 'success');
      this.navCtrl.navigateBack('/tab/crearEcheq/sector-mis-echeq/2');
    }).catch( () => {
      console.log('Error en BD!');
    });
  }

}




