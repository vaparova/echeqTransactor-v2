import { Component, Input, OnInit } from '@angular/core';
import { MbscEventcalendarOptions } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
})
export class CalendarioComponent implements OnInit {
  @Input() vista: string;
  titulo: string;

  events: any;

  calendario: object = {
    calendar: { type: 'month', popover: true },
  };
  lista: object = {
    eventList: { type: 'month', scrollable: true}
  };

  eventSettings: MbscEventcalendarOptions;

  constructor(private http: HttpClient, private navCtrl: NavController) {}

  ngOnInit() {
    if (this.vista === '1'){
      this.titulo = 'Eventos';
      this.eventSettings = {
        lang: 'es',
        theme: 'material',
        themeVariant: 'light',
        display: 'inline',
        view: this.lista
      };
    }else{
      this.titulo = 'Calendario';
      this.eventSettings = {
        lang: 'es',
        theme: 'material',
        themeVariant: 'light',
        display: 'inline',
        view: this.calendario
      };
    }

    this.http.jsonp('https://trial.mobiscroll.com/events/', 'callback').subscribe((resp: any) => {
          this.events = resp;
      });
  }

  verEventos() {
    this.navCtrl.navigateForward('/eventos');
  }
}
