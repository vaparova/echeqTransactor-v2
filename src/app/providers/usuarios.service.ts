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

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarios: DatosUsuario[] = [];

  constructor() {
    const data = this.cargarStorage();

    if (!data){
      const user = new DatosUsuario(
        new DatosPersonales(
          'Martín',
          'Molina',
          'servicebelgrano@hotmail.com',
          20277852536,
          5492615874932
        ),
        new DatosPostales(
          'belgrano',
          519,
          'Godoy Cruz',
          'Mendoza',
          5501
        ),
        new DatosIngreso('molina1979', 'mol1979mol')
      );
      this.nuevoUsuario(user);

      const user2 = new DatosUsuario(
        new DatosPersonales(
          'Vanesa',
          'Romero',
          'vaparova_92@hotmail.com',
          27364183807,
          5492615058054
        ),
        new DatosPostales(
          'avellaneda',
          388,
          'Godoy Cruz',
          'Mendoza',
          5501
        ),
        new DatosIngreso('vaparova', 'vp1992rv')
      );
      this.nuevoUsuario(user2);

      const cuentaUser2 = new DatosCuentas(
        new DatosEntidad('Banco Nacion', '011', 'Godoy Cruz', '285', '5501'),
        new DatosCuenta( '0110285930028500003701', 'CC', '2850000370', 'Romero Vanesa'),
        'clavedeactivacionuser2');
      this.adherirCuenta(cuentaUser2, user2.usuario.datosPersonales.cuil);

      const otraCuentaUser2 = new DatosCuentas(
        new DatosEntidad('Banco Galicia', '007', 'Godoy Cruz', '246', '5501'),
        new DatosCuenta('007024530093500000524', 'CC', '9350000052', 'Romero Vanesa'),
        'clave de activacionuser2');
      this.adherirCuenta(otraCuentaUser2, user2.usuario.datosPersonales.cuil);

      const chequeraUser2 = new DatosChequeras();
      chequeraUser2.crearChequera(1, 'codigodeactivacion');
      chequeraUser2.cantidadDisponible = 10;
      this.nuevaChequera(chequeraUser2, cuentaUser2, 27364183807);

      const otraChequeraUser2 = new DatosChequeras();
      otraChequeraUser2.crearChequera(1, 'codigodeactivacion');
      this.nuevaChequera(otraChequeraUser2, otraCuentaUser2, 27364183807);


    }else{
      console.log('Data pre-existente en localStorage');
    }
  }

  // M É T O D O S    P R O P I O S

  private nuevoUsuario(usuario: DatosUsuario){
    this.usuarios.push(usuario);
    this.guardarStorage();
  }

  private adherirCuenta(cuenta: DatosCuentas, cuil: number){
    const user = this.obtenerUsuario(cuil);
    user.usuario.datosCuentas.push(cuenta);
    this.modificarUsuario(cuil, user);
  }

  private nuevaChequera(chequera: DatosChequeras, cuenta: DatosCuentas, cuil: number){
    const user = this.obtenerUsuario(cuil);
    const arrCtas = user.usuario.datosCuentas;
    const cbu =  cuenta.cuentas.cuenta.cbu;
    const i = this.indexCuenta(arrCtas, cbu);
    arrCtas[i].cuentas.chequeras.push(chequera);
    this.modificarUsuario(cuil, user);
  }

  // A L M A C E N A M I E N T O   L O C A L

  private guardarStorage(){
    localStorage.setItem('data', JSON.stringify(this.usuarios));
  }

  private cargarStorage(){
    if (localStorage.getItem('data')) {
      this.usuarios = JSON.parse(localStorage.getItem('data'));
      return true;
      }
    return false;
  }

  // F U N C I O N E S    U S U A R I O

  verUsuarios(){
    return this.usuarios;
  }

  obtenerUsuario(cuil: number){
   return this.usuarios.find( resp => resp.usuario.datosPersonales.cuil === cuil);
  }

  obtenerIndex(cuil: number){
    return this.usuarios.indexOf(this.obtenerUsuario(cuil));
  }

  modificarUsuario(cuil: number, userMod: DatosUsuario){
    const i = this.obtenerIndex(cuil);
    this.usuarios.splice(i, 1, userMod);
    this.guardarStorage();
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


