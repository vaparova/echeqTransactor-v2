import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sector-echeq-recibidos',
  templateUrl: './sector-echeq-recibidos.page.html',
  styleUrls: ['./sector-echeq-recibidos.page.scss'],
})
export class SectorEcheqRecibidosPage implements OnInit {

  index: any;
  ruta = [
    {atras: 'No definido',
     comp: 'No definido'},
    {atras: 'tab/crearEcheq',
     comp: 'Mis Echeq > Crear Echeq'},
    {atras: 'tab/crearEcheq',
     comp: 'Mis Echeq > Echeq Generados'},
    {atras: 'tab/crearEcheq',
     comp: 'Mis Echeq > Echeq Entregados'}
  ];

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( data => {
      this.index = Number(Object.values(data).toString());
    });
   }

  ngOnInit() {
  }

}
