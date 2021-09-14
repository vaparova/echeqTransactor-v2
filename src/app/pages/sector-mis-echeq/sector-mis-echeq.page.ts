import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sector-mis-echeq',
  templateUrl: './sector-mis-echeq.page.html',
  styleUrls: ['./sector-mis-echeq.page.scss'],
})
export class SectorMisEcheqPage implements OnInit {

  index: any;
  ruta = [
    {atras: 'No definido',
     comp: 'No definido'},
    {atras: 'tab/crearEcheq',
     comp: 'Mis Echeq > Crear Echeq'},
    {atras: 'tab/crearEcheq',
     comp: 'Mis Echeq > Generar Echeq'},
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
