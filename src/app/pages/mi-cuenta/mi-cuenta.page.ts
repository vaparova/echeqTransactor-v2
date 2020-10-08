import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
})
export class MiCuentaPage implements OnInit {
  nombre = 'Mi Cuenta';
  descripcion = 'En esta seccion podrás visualizar y modificar tus datos personales o tu contraseña. Además podrás administrar tus cuentas bancarias y solicitudes de chequeras electrónicas';
  botones = [
    {titulo: 'Datos Personales'},
    {titulo: 'Cambiar Contraseña'},
    {titulo: 'Token'},
    {titulo: 'Cuentas Bancarias'},
    {titulo: 'Chequeras Electrónicas'}
          ];
  constructor() { }

  ngOnInit() {
  }

}
