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
    {atras: 'No definido',
     comp: 'No definido'},
    {atras: 'miCuenta',
     comp: 'Mi Cuenta > Datos Personales'},
    {atras: 'miCuenta',
     comp: 'Mi Cuenta > Cambiar Contraseña'},
    {atras: 'miCuenta',
     comp: 'Token'},
    {atras: 'miCuenta',
     comp: 'Mi Cuenta > Cuentas Bancarias'},
    {atras: 'miCuenta',
     comp: 'Mi Cuenta > Chequeras Electrónicas'},
    {atras: 'miCuenta/sector-mi-cuenta/5',
     comp: 'Chequeras Electrónicas > Nueva Chequera'},
  ];
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( data => {
      this.index = Number(Object.values(data).toString());
    });
   }

  ngOnInit() {
  }

}
