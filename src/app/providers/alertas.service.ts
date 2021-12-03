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

