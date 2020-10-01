import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Notificacion } from '../../models/notificacion.model';
import { AlertasService } from '../../providers/alertas.service';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {

  alertas: Notificacion[];

  constructor(private navCtrl: NavController, private alts: AlertasService) {
    this.alertas = this.alts.getAlertas();
  }

  verDetalle(i: number) {
    this.navCtrl.navigateForward(`/alerta/ ${i}`);
  }

  ngOnInit() {}

}
