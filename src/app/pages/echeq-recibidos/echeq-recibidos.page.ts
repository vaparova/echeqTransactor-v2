import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-echeq-recibidos',
  templateUrl: './echeq-recibidos.page.html',
  styleUrls: ['./echeq-recibidos.page.scss'],
})
export class EcheqRecibidosPage implements OnInit {

  nombre = 'Echeq Recibidos';
  descripcion = ' En esta sección podrás administrar los Echeq donde seas beneficiario. Podras recibir, repudiar, depositar, custodiar, entre otras acciones';
  botones = [
    {
      titulo: 'Administrar Recibidos',
      link: '1'
    },
    {
      titulo: 'Echeq Depositados',
      link: '2'
    },
    {
      titulo: 'Echeq Endosados',
      link: '3'
    },
  ];
  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  verComponente(i: number){
    console.log(i);
    this.navCtrl.navigateForward(`/tab/echeqRecibidos/sector-echeq-recibidos/${i}`);
  }

}
