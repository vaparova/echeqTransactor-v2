import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '../../providers/alertas.service';
import { Notificacion } from '../../models/notificacion.model';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.page.html',
  styleUrls: ['./alerta.page.scss'],
})
export class AlertaPage implements OnInit {
  alerta: Notificacion;
  index: number;

  constructor(private route: ActivatedRoute, private alts: AlertasService) {
    this.route.params.subscribe( data => {
      this.index = Number(Object.values(data).toString());
      this.alerta = this.alts.getAlerta(this.index);
      console.log(this.alerta);
    });

  }

  ngOnInit() {
  }

}
