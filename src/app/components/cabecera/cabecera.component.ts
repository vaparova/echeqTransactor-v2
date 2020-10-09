import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.scss'],
})
export class CabeceraComponent implements OnInit {
  @Input() ruta: string;
  @Input() back: string;
  constructor(private navCtrl: NavController) {
  }

  ngOnInit() {}
  volver(){
    this.navCtrl.navigateBack(`/${this.back}`);
  }
}
