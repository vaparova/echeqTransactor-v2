import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Notificacion } from '../../models/notificacion.model';
import { AlertasService } from '../../providers/alertas.service';
import { DatosAlertas } from '../../models/datosAlertas';


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent implements OnInit {

  alertas: DatosAlertas[];

  constructor(private navCtrl: NavController, private alts: AlertasService) {
    this.alertas = this.alts.getAlertas();
  }

  verDetalle(i: number) {
    this.navCtrl.navigateForward(`/tab/index/alerta/ ${i}`);
  }

  ngOnInit() {}

}
