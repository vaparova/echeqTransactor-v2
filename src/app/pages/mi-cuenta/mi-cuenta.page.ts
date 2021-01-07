import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
})
export class MiCuentaPage implements OnInit {
  nombre = 'Mi Cuenta';
  descripcion = 'En esta seccion podrás visualizar y modificar tus datos personales o tu contraseña. Además podrás administrar tus cuentas bancarias y solicitudes de chequeras electrónicas';
  botones = [
    {
      titulo: 'Datos Personales',
      link: '1'
    },
    {
      titulo: 'Cambiar Contraseña',
      link: '2'
    },
    {
      titulo: 'Token',
      link: '3'
    },
    {
      titulo: 'Cuentas Bancarias',
      link: '4'
    },
    {
      titulo: 'Chequeras Electrónicas',
      link: '5'
    }
  ];
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  verComponente(i: number){
    console.log(i);
    this.navCtrl.navigateForward(`/tab/miCuenta/sector-mi-cuenta/${i}`);
  }
}
