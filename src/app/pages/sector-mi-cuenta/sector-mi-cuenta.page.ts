import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sector-mi-cuenta',
  templateUrl: './sector-mi-cuenta.page.html',
  styleUrls: ['./sector-mi-cuenta.page.scss'],
})
export class SectorMiCuentaPage implements OnInit {
  index: any;
  ruta = [
    'no definido',
    'Mi Cuenta > Datos Personales',
    'Mi Cuenta > Cambiar Contraseña',
    'Mi Cuenta > Token'
  ];
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( data => {
      this.index = Number(Object.values(data).toString());
    });
   }

  ngOnInit() {
  }

}
