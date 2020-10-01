import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Notificacion } from '../../models/notificacion.model';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {

  alertas: Notificacion[];

  constructor(private navCtrl: NavController) {
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

  verDetalle(i: number) {
    console.log('evento click');
    this.navCtrl.navigateForward(`/alerta/ ${i}`);
  }

  ngOnInit() {}

}
