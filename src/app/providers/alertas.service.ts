import { Injectable } from '@angular/core';
import { Notificacion } from '../models/notificacion.model';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  alertas: Notificacion[];

  constructor() {
    this.alertas = [
      {
        titulo: 'Has recibido un nuevo Echeq',
        detalle: 'Has recibido el valor 00002641'
      },
      {
        titulo: 'Tienes Echeq disponibles para depositar',
        detalle: 'Revisa tu calendario para ver echeqs pronto a ser depositados'
      },
      {
        titulo: 'Tu Echeq en custodia se depositará hoy',
        detalle: 'El valor 00072486 será depositado en tu cuenta de Banco Nación'
      }
    ];
  }

  getAlertas(): Notificacion []{
    return this.alertas;
  }

  getAlerta(i: number): Notificacion{
    return this.alertas[i];
  }
}

