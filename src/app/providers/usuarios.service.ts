import { Injectable } from '@angular/core';
import { DatosUsuario } from '../models/datosUsuario';
import { DatosPersonales } from '../models/datosPersonales';
import { DatosPostales } from '../models/datosPostales';
import { DatosIngreso } from '../models/datosIngreso';
import { DatosCuentas } from '../models/datosCuentas';
import { DatosEntidad } from '../models/datosEntidad';
import { DatosCuenta } from '../models/datosCuenta';
import { DatosToken } from '../models/datosToken';
import { DatosChequeras } from '../models/datosChequeras';

// R E A L T I M E    B D
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { DatosSesion } from '../models/datosSesion';
import { ToastsService } from './toasts.service';
import { NavController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarios: DatosUsuario[] = [];
  usuariobd: DatosUsuario;
  private item: Observable<any>;
  sesion: DatosSesion;
  private time: number;

  constructor( private afs: AngularFireDatabase,
               private toast: ToastsService,
               private navCtrl: NavController ) {
    this.time = 120000;
  }

  // M É T O D O S    P R O P I O S

  private nuevoUsuario(usuario: DatosUsuario): void{
    if (usuario){
      console.log('se esta creando un nuevo usuario local');
      this.usuarios[0] = usuario;
      console.log(this.usuarios);
      this.guardarStorage();
      return;
    }else{
      console.log('no se obtuvo usuario');
      this.borrarSesion();
      return;
    }
  }

  private adherirCuenta(cuenta: DatosCuentas, cuil: number): void{
    const user = this.obtenerUsuario(cuil);
    user.usuario.datosCuentas.push(cuenta);
    this.modificarUsuario(cuil, user);
  }

  private nuevaChequera(chequera: DatosChequeras, cuenta: DatosCuentas, cuil: number): void{
    const user = this.obtenerUsuario(cuil);
    const arrCtas = user.usuario.datosCuentas;
    const cbu =  cuenta.cuentas.cuenta.cbu;
    const i = this.indexCuenta(arrCtas, cbu);
    arrCtas[i].cuentas.chequeras.push(chequera);
    this.modificarUsuario(cuil, user);
  }

  // M É T O D O S    F I R E B A S E   R E A L T I M E   D A T E B A S E

  setearUsuarioFb() {
    if (this.usuariobd){
      this.nuevoUsuario(this.usuariobd);
    }else{
      this.borrarSesion();
    }
  }

  verificarUsuarioFb(cuil: number): void{
    console.log('entro a verificarUsuarioFb');
    this.buscarUsuarioFb(cuil);
  }

  verificarUsuarioBd(): boolean{
    console.log('verificar resultado');
    if (this.usuariobd){
      console.log('usuariobd seteado');
      console.log(this.usuariobd);
      return true;
    }else{
      console.log('usuariobd vacío');
      this.borrarSesion();
      return false;
    }
  }

  private buscarUsuarioFb(cuil: number) {
    console.log(`Ejecutando buscarUsuarioFb, cuil: ${cuil}`);
    this.item = this.afs.object(`usuarios/${cuil}`).snapshotChanges();
    this.item.subscribe( action => {
      this.usuariobd = action.payload.val();
      console.log(`resultado usuarioFb: ${action.payload.val()}`);
    });
  }

  loginFb(cuil: number): Observable<any>{
    return this.afs.object(`usuarios/${cuil}`).snapshotChanges();
  }

  private nuevoUsuarioFb(cuil: number, datos: DatosUsuario): void{
    this.afs.object(`usuarios/${cuil}`).set(datos);
  }

  public modificarUsuario(cuil: number, datos: DatosUsuario): Promise<any> {
    this.modificarUsuarioOk(cuil, datos);
    return this.afs.object(`usuarios/${cuil}`).update(datos);
  }

  // A L M A C E N A M I E N T O   L O C A L

  private guardarStorage(): void{
    localStorage.setItem('data', JSON.stringify(this.usuarios));
  }

  guardarSesion(sesion: DatosSesion): void{
    localStorage.setItem('sesion', JSON.stringify(sesion));
  }

  obtenerSesion(): DatosSesion{
    if (localStorage.getItem('sesion')) {
      this.sesion = JSON.parse(localStorage.getItem('sesion'));
      console.log(this.sesion);
      return this.sesion;
      }
    return null;
  }

  cargarStorage(): boolean{
    if (localStorage.getItem('data')) {
      this.usuarios = JSON.parse(localStorage.getItem('data'));
      return true;
      }
    return false;
  }

  borrarSesion(): void{
    this.usuarios = [];
    this.usuariobd = null;
    this.sesion = null;
    localStorage.clear();
  }

  validarSesion(): DatosSesion{
    const a =  this.obtenerSesion();
    console.log(`componente: Obteniendo la sesion => ${a}`);
    if (a){
      console.log(`componente: Obteniendo el cuil del sesion en US => ${this.sesion.cuil}`);
      this.cargarStorage();
      console.log(`se está obteniendo datos desde el localStorage`);
      return this.sesion;
    }else{
      return null;
    }
  }
  // F U N C I O N E S    U S U A R I O

  verUsuarios(){
    return this.usuarios;
  }

  verificarContrasena(pass: string): boolean{
    const us = this.usuariobd;
    if (us.usuario.datosIngreso.password === pass){
      console.log('contraseña correcta');
      console.log(us.usuario.datosIngreso.password);
      console.log(pass);
      return true;
    }else{
      this.borrarSesion();
      console.log('constraseña incorrecta');
      return false;
    }
  }

  obtenerUsuario(cuil: number): DatosUsuario{
    console.log(`US obtenerUsuario() cuil recibido: ${cuil}`);
    console.log(this.usuarios);
    console.log(this.usuarios.find( resp => resp.usuario.datosPersonales.cuil === cuil));
    return this.usuarios.find( resp => resp.usuario.datosPersonales.cuil === cuil);
    // return this.usuarios[0];
  }

  obtenerIndex(cuil: number){
    return this.usuarios.indexOf(this.obtenerUsuario(cuil));
  }

  modificarUsuarioOk(cuil: number, userMod: DatosUsuario){
    const i = this.obtenerIndex(cuil);
    this.usuarios.splice(0, 1, userMod);
    this.guardarStorage();
  }

  actividad(){
    this.time = this.time + 60000;
  }

  logOut(){
    setTimeout( () => {
      this.borrarSesion();
      this.toast.mostrarToast('Sesión Caducada!, debe volver a ingresar', 'danger');
      this.navCtrl.navigateBack('/ingreso');
    }, this.time);
  }

  // F U N C I O N E S   T O K E N

  altaToken(cuil: number, userMod: DatosUsuario, pin: number, uid: string){
    const tkn = new DatosToken();
    tkn.altaToken(pin, uid);
    userMod.usuario.datosToken = tkn;
    this.modificarUsuario(cuil, userMod);
  }

  bajaToken(cuil: number, userMod: DatosUsuario){
    const tkn = new DatosToken();
    tkn.bajaToken();
    userMod.usuario.datosToken = tkn;
    this.modificarUsuario(cuil, userMod);
  }

  // F U N C I O N E S   C U E N T A S

  vincularCuenta(cuil: number, userMod: DatosUsuario, cuenta: DatosCuentas){
    const cuentasArr = userMod.usuario.datosCuentas;
    const cbu = cuenta.cuentas.cuenta.cbu;

    const i = this.indexCuenta(cuentasArr, cbu);
    cuenta.cuentas.estado = true;
    cuentasArr.splice(i, 1, cuenta);

    userMod.usuario.datosCuentas = cuentasArr;
    this.modificarUsuario(cuil, userMod);
    this.guardarStorage();
  }

  desvincularCuenta(cuil: number, userMod: DatosUsuario,
                    cuenta: DatosCuentas){
    const cuentasArr = userMod.usuario.datosCuentas;
    const cbu = cuenta.cuentas.cuenta.cbu;
    console.log(cbu);

    const i = this.indexCuenta(cuentasArr, cbu);
    cuenta.cuentas.estado = false;
    cuenta.cuentas.chequeras = [];
    cuenta.cuentas.claveActivación = 'inhabilitada';
    cuentasArr.splice(i, 1, cuenta);

    userMod.usuario.datosCuentas = cuentasArr;
    this.modificarUsuario(cuil, userMod);
    this.guardarStorage();
  }

  indexCuenta(cuentasArr: DatosCuentas[], cbu: string){
    const cuenta = cuentasArr.find( resp => resp.cuentas.cuenta.cbu === cbu);
    return cuentasArr.indexOf(cuenta);
  }

  // F U N C I O N E S   C H E Q U E R A S   E L E C T R O N I C A S

  activarChequeraElectronica(chequera: any, cuenta: DatosCuentas, cuil: number){
    const user = this.obtenerUsuario(cuil);
    const arrCtas = user.usuario.datosCuentas;        // array de cuentas del usuario
    const cbu =  cuenta.cuentas.cuenta.cbu;           // cbu de la cuenta a modificar
    const arrCheq = cuenta.cuentas.chequeras;
    const indexCta = this.indexCuenta(arrCtas, cbu);  // indice de cuentas
    const indexCheq = this.indexChequera(arrCheq, chequera.cheq.nroPrimerEcheq); // indice de chequera
    const cheq = arrCtas[indexCta].cuentas.chequeras[indexCheq];
    cheq.estadoChequera = true;                       // actualización de chequera
    arrCtas[indexCta].cuentas.chequeras.splice(indexCheq, 1, cheq);
    user.usuario.datosCuentas = arrCtas;
    this.modificarUsuario(cuil, user);
    this.guardarStorage();
  }

  indexChequera(chequerasArr: DatosChequeras[], primerEcheq: number){
    const chequera = chequerasArr.find( resp => resp.nroPrimerEcheq === primerEcheq);
    return chequerasArr.indexOf(chequera);
  }

  pedirChequera(cuenta: DatosCuentas, cuil: number){
    console.log('pedirChequera()');
    const chequera = new DatosChequeras();
    this.nuevaChequera(chequera, cuenta, 27364183807);
  }
}


