import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subsecciones',
  templateUrl: './subsecciones.component.html',
  styleUrls: ['./subsecciones.component.scss'],
})
export class SubseccionesComponent implements OnInit {
  subsecciones = [];
  constructor() {
    this.subsecciones = [
        {
          titulo: 'Echeq Generados',
          descripcion: 'Aquí podrás administrar los echeq que hayas generado y aún no hayas librado. Podrás modificarlos, eliminarlos, firmarlos y librarlos',
          link: '/generados'
        },
        {
          titulo: 'Echeq Librados',
          descripcion: 'Aquí podrás administrar los echeq que hayas librado a un tercero. Podrás consultar ver motivos de devolución y/o rechazos.',
          link: '/librados'
        },
        {
          titulo: 'Echeq Depositados',
          descripcion: 'Aquí podrás administrar los echeq que hayas depositado en una cuenta vinculada. Podrás consultar Echeq Presentados y Rechazados.',
          link: '/depositados'
        },
        {
          titulo: 'Echeq Endosados',
          descripcion: 'Aquí podrás administrar los echeq que hayas endosado y cedido a un tercero. Podrás consultar y ver motivos de devolución y/o rechazos.',
          link: '/endosados'
        },
    ];
  }

  ngOnInit() {}

}
