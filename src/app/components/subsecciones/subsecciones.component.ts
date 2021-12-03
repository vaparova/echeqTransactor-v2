import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-subsecciones',
  templateUrl: './subsecciones.component.html',
  styleUrls: ['./subsecciones.component.scss'],
})
export class SubseccionesComponent implements OnInit {
  subsecciones = [];

  constructor(private navCtrl: NavController) {
    this.subsecciones = [
        {
          titulo: 'Echeq Generados',
          descripcion: 'Aquí podrás administrar los echeq que hayas generado y aún no hayas librado. Podrás modificarlos, eliminarlos, firmarlos y librarlos',
          link: '/tab/crearEcheq/sector-mis-echeq/2'
        },
        {
          titulo: 'Echeq Entregados',
          descripcion: 'Aquí podrás administrar los echeq que hayas librado a un tercero. Podrás consultar ver motivos de devolución y/o rechazos.',
          link: '/tab/crearEcheq/sector-mis-echeq/3'
        },
        {
          titulo: 'Echeq Depositados',
          descripcion: 'Aquí podrás administrar los echeq que hayas depositado en una cuenta vinculada. Podrás consultar Echeq Presentados y Rechazados.',
          link: '/tab/echeqRecibidos/sector-echeq-recibidos/2'
        },
        {
          titulo: 'Echeq Endosados',
          descripcion: 'Aquí podrás administrar los echeq que hayas endosado y cedido a un tercero. Podrás consultar y ver motivos de devolución y/o rechazos.',
          link: '/tab/echeqRecibidos/sector-echeq-recibidos/3'
        },
    ];
  }

  ngOnInit() {}

  navegar(i: number){
    const link = this.subsecciones[i].link;
    this.navCtrl.navigateBack(`${link}`);

  }

}
