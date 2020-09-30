import { Component, OnInit } from '@angular/core';
import { Notificacion } from '../../models/notificacion.model';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {

  alertas: Notificacion[];

  constructor() {
    this.alertas = [
      {
        titulo: 'Has recibido un nuevo Echeq',
        detalle: 'Has recibido el valor 00002641'
      },
      {
        titulo: 'Tienes Echeq disponibles para depositar',
        detalle: 'Revisa tu calendario para ver tus echeq pronto a ser depositados'
      }
    ];
  }

  ngOnInit() {}

}
