import { Injectable } from '@angular/core';
import { DatosAlertas } from '../models/datosAlertas';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  alertas: DatosAlertas[] = [];

  constructor() {
    this.agregarAlerta('Has recibido un nuevo Echeq', 'Has recibido el valor 00002641');

  }
  // {
  //   titulo: 'Has recibido un nuevo Echeq',
  //   detalle: 'Has recibido el valor 00002641'
  // },
  // {
  //   titulo: 'Tienes Echeq disponibles para depositar',
  //   detalle: 'Revisa tu calendario para ver echeqs pronto a ser depositados'
  // },
  // {
  //   titulo: 'Tu Echeq en custodia se depositará hoy',
  //   detalle: 'El valor 00072486 será depositado en tu cuenta de Banco Nación'
  // }
  agregarAlerta(tit: string, det: string): void{
    this.alertas.push(this.crearAlerta(tit, det));
  }

  getAlertas(): DatosAlertas []{
    return this.alertas;
  }

  getAlerta(i: number): DatosAlertas{
    return this.alertas[i];
  }

  private crearAlerta(tit: string, det: string): DatosAlertas{
    return new DatosAlertas(tit, det);
  }
}

