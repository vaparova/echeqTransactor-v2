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
    this.time = 300000;
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

  agregarCtaNacion(){
    const cuentaUser2 = new DatosCuentas(
      new DatosEntidad('Banco Nacion', '011', 'Godoy Cruz', '285', '5501'),
      new DatosCuenta( '0110285930028500003701', 'CC', '2850000370', 'Romero Vanesa'),
      'clavedeactivacionuser2');
    this.adherirCuenta(cuentaUser2, 27364183807);
  }

  // M É T O D O S    F I R E B A S E   R E A L T I M E   D A T E B A S E

  setearUsuarioFb(): void {
    if (this.usuariobd){
      this.nuevoUsuario(this.usuariobd);
    }else{
      this.borrarSesion();
    }
  }

  syncChanges(): void{
    this.obtenerSesion();
    const cuil = this.sesion.cuil;
    const i = this.obtenerIndex(cuil);
    this.item = this.afs.object(`usuarios/${cuil}`).snapshotChanges();
    // tslint:disable-next-line: deprecation
    this.item.subscribe( action => {
      this.usuarios[i] = action.payload.val();
      this.guardarStorage();
      console.log(`actualizando usuario index ${i}`);
      console.log(action.payload.val());
    });
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

  modificarUsuario(cuil: number, datos: DatosUsuario): Promise<any> {
    this.modificarUsuarioOk(cuil, datos);
    return this.afs.object(`usuarios/${cuil}`).update(datos);
  }

  private buscarUsuarioFb(cuil: number): void {
    console.log(`Ejecutando buscarUsuarioFb, cuil: ${cuil}`);
    this.item = this.afs.object(`usuarios/${cuil}`).snapshotChanges();
    // tslint:disable-next-line: deprecation
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


  // A L M A C E N A M I E N T O   L O C A L

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
      this.syncChanges();
      return this.sesion;
    }else{
      return null;
    }
  }

  private guardarStorage(): void{
    localStorage.setItem('data', JSON.stringify(this.usuarios));
  }
  // F U N C I O N E S    U S U A R I O

  verUsuarios(): DatosUsuario[] {
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

  obtenerIndex(cuil: number): number{
    return this.usuarios.indexOf(this.obtenerUsuario(cuil));
  }

  modificarUsuarioOk(cuil: number, userMod: DatosUsuario): void{
    const i = this.obtenerIndex(cuil);
    this.usuarios.splice(0, 1, userMod);
    this.guardarStorage();
  }

  actividad(): void{
    this.time = this.time + 60000;
  }

  logOut(): void{
    setTimeout( () => {
      this.borrarSesion();
      this.toast.mostrarToast('Sesión Caducada!, debe volver a ingresar', 'danger');
      this.navCtrl.navigateBack('/ingreso');
      const hora = new Date();
      console.log(`sesion caducada a las ${hora}`);
    }, this.time);
  }

  // F U N C I O N E S   T O K E N

  altaToken(cuil: number, userMod: DatosUsuario, pin: number, uid: string): void{
    const tkn = new DatosToken();
    tkn.altaToken(pin, uid);
    userMod.usuario.datosToken = tkn;
    this.modificarUsuario(cuil, userMod);
  }

  bajaToken(cuil: number, userMod: DatosUsuario): void{
    const tkn = new DatosToken();
    tkn.bajaToken();
    userMod.usuario.datosToken = tkn;
    this.modificarUsuario(cuil, userMod);
  }

  // F U N C I O N E S   C U E N T A S

  vincularCuenta(cuil: number, userMod: DatosUsuario, cuenta: DatosCuentas): Promise<any>{
    userMod.usuario.datosCuentas = this.modArrayCtas(
      this.getArrCuentas(userMod),
      this.getIndexCuenta(this.getArrCuentas(userMod), this.getCbuCuenta(cuenta)),
      this.activarCuenta(cuenta)
      );
    return this.modificarUsuario(cuil, userMod);
  }

  desvincularCuenta(cuil: number, userMod: DatosUsuario, cuenta: DatosCuentas): Promise<any>{
    userMod.usuario.datosCuentas = this.modArrayCtas(
      this.getArrCuentas(userMod),
      this.getIndexCuenta(this.getArrCuentas(userMod), this.getCbuCuenta(cuenta)),
      this.desactivarCuenta(cuenta)
      );
    return this.modificarUsuario(cuil, userMod);
  }

  private getIndexCuenta(cuentasArr: DatosCuentas[], cbu: string): number{
    const cuenta = cuentasArr.find( resp => resp.cuentas.cuenta.cbu === cbu);
    return cuentasArr.indexOf(cuenta);
  }

  private getCbuCuenta(cuenta: DatosCuentas): string{
    return cuenta.cuentas.cuenta.cbu;
  }

  getArrCuentas(userMod: DatosUsuario): DatosCuentas[]{
    return userMod.usuario.datosCuentas;
  }

  private activarCuenta(cuenta: DatosCuentas): DatosCuentas{
    cuenta.cuentas.estado = true;
    return cuenta;
  }

  private desactivarCuenta(cuenta: DatosCuentas): DatosCuentas{
    const cta: DatosCuentas = cuenta;
    cta.cuentas.estado = false;
    cta.cuentas.chequeras = [];
    cta.cuentas.claveActivación = 'desvinculada';
    return cta;
  }

  private modArrayCtas(cuentasArr: DatosCuentas[], i: number, cuenta: DatosCuentas): DatosCuentas[]{
    cuentasArr.splice(i, 1, cuenta);
    return cuentasArr;
  }

  // F U N C I O N E S   C H E Q U E R A S   E L E C T R O N I C A S

  pedirChequera(cuenta: DatosCuentas, cuil: number): Promise<any>{
    console.log('pedirChequera()');
    const chequera = new DatosChequeras();
    return this.nuevaChequera(chequera, cuenta, cuil);
  }

  activarChequeraElectronica(cuenta: DatosCuentas, idxCheq: number, cuil: number): Promise<any> {
    const user = this.obtenerUsuario(cuil);
    user.usuario.datosCuentas = this.modArrChequeras(
      this.getArrCuentas(user),
      this.getIndexCuenta(this.getArrCuentas(user), this.getCbuCuenta(cuenta)),
      idxCheq,
      this.activarChequera(cuenta, idxCheq)
    );
    console.log(user);
    return this.modificarUsuario(cuil, user);
  }


  cancelarPedidoChequera(cuenta: DatosCuentas, cuil: number): Promise<any>{
    console.log('cancelarPedidoChequera() - US');
    console.log(cuenta);
    const user = this.obtenerUsuario(cuil);
    const arrCtasMod = this.modArrayCtas(
      this.getArrCuentas(user),
      this.getIndexCuenta(this.getArrCuentas(user), cuenta.cuentas.cuenta.cbu),
      this.eliminarChequera(cuenta, this.getIndexPedidoPte(cuenta))
    );
    user.usuario.datosCuentas = arrCtasMod;
    console.log(user);
    return this.modificarUsuario(cuil, user);
  }

  aprobarPedidoChequera(cuenta: DatosCuentas, cuil: number, i: number): Promise<any>{
    console.log('AprobarPedidoChequera() - US');
    const user = this.obtenerUsuario(cuil);
    const cheq = this.crearChequera(1, 'claveactivarchequera');
    const arrCtasMod = this.modArrChequeras(
      this.getArrCuentas(user),
      this.getIndexCuenta(this.getArrCuentas(user), cuenta.cuentas.cuenta.cbu),
      i, cheq
    );
    console.log(arrCtasMod);
    user.usuario.datosCuentas = arrCtasMod;
    return this.modificarUsuario(cuil, user);
  }

  private nuevaChequera(chequera: DatosChequeras, cuenta: DatosCuentas, cuil: number): Promise<any>{
    const user = this.obtenerUsuario(cuil);
    try{
      this.agregarChequera(
        this.getArrCuentas(user),
        this.getIndexCuenta(this.getArrCuentas(user), this.getCbuCuenta(cuenta)),
        chequera
        );
      return this.modificarUsuario(cuil, user);
    }catch (error){
      console.log('Cuenta sin chequeras pre existentes');
      const arrCtas = this.getArrCuentas(user);
      const i = this.getIndexCuenta(this.getArrCuentas(user), this.getCbuCuenta(cuenta));
      const a = new DatosCuentas(cuenta.cuentas.entidad, cuenta.cuentas.cuenta, 'activar');
      this.activarCuenta(a);
      a.cuentas.chequeras.push(chequera);
      arrCtas[i] = a;
      return this.modificarUsuario(cuil, user);
    }
  }

  private getIndexPedidoPte(cuenta: DatosCuentas): number{
    let i: number = null;
    cuenta.cuentas.chequeras.forEach(resp => {
      if (resp.estadoPedido === false){
        i = cuenta.cuentas.chequeras.indexOf(resp);
      }
    });
    return i;
  }

  private crearChequera(nroPrimerE: number, clave: string): DatosChequeras{
    const cheq = new DatosChequeras();
    cheq.crearChequera(1, 'codigodeactivacionchequera');
    return cheq;
  }

  private getIndexChequera(chequerasArr: DatosChequeras[], primerEcheq: number): number{
    const chequera = chequerasArr.find( resp => resp.nroPrimerEcheq === primerEcheq);
    return chequerasArr.indexOf(chequera);
  }

  private getArrChequeras(arrCtas: DatosCuentas): DatosChequeras[] {
    return arrCtas.cuentas.chequeras;
  }

  private activarChequera(cta: DatosCuentas, indexCheq: number): DatosChequeras{
    console.log(cta, indexCheq);
    const cheqMod = cta.cuentas.chequeras[indexCheq];
    cheqMod.estadoChequera = true;
    console.log(cheqMod);
    return cheqMod;
  }

  private agregarChequera(arrCtas: DatosCuentas[], indexCta: number, cheq: DatosChequeras){
    arrCtas[indexCta].cuentas.chequeras.push(cheq);
  }

  private modArrChequeras(arrCtas: DatosCuentas[], indexCta: number, indexCheq: number, cheq: DatosChequeras): DatosCuentas[]{
    arrCtas[indexCta].cuentas.chequeras.splice(indexCheq, 1, cheq);
    return arrCtas;
  }
  private eliminarChequera(cta: DatosCuentas, indexCheq: number): DatosCuentas{
    cta.cuentas.chequeras.splice(indexCheq, 1);
    return cta;
  }
}


