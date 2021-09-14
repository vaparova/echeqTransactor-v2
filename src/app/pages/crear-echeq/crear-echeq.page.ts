import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-crear-echeq',
  templateUrl: './crear-echeq.page.html',
  styleUrls: ['./crear-echeq.page.scss'],
})
export class CrearEcheqPage implements OnInit {

  nombre = 'Mis Echeq';
descripcion = ' En esta sección podrás crear nuevos Echeq y luego administrarlos. Podras modificar, firmar, eliminar y librar Echeq';
botones = [
  {
    titulo: 'Crear Echeq',
    link: '1'
  },
  {
    titulo: 'Echeq Generados',
    link: '2'
  },
  {
    titulo: 'Echeq Entregados',
    link: '3'
  },
];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  verComponente(i: number){
    console.log(i);
    this.navCtrl.navigateForward(`/tab/crearEcheq/sector-mis-echeq/${i}`);
  }

}

