import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-enviar-token',
  templateUrl: './enviar-token.component.html',
  styleUrls: ['./enviar-token.component.scss'],
})
export class EnviarTokenComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  cerrar(){
    this.modalCtrl.dismiss({
      verificado: true
    });
  }

}
