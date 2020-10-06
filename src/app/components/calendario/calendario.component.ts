import { Component, OnInit } from '@angular/core';
import { MbscEventcalendarOptions } from '@mobiscroll/angular';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
})
export class CalendarioComponent implements OnInit {

  constructor(private http: HttpClient, private navCtrl: NavController) {}
  events: any;

  eventSettings: MbscEventcalendarOptions = {
      lang: 'es',
      theme: 'material',
      themeVariant: 'light',
      display: 'inline',
      view: {
          calendar: { type: 'month', popover: true },
         // eventList: { type: 'month', scrollable: true }
      }
  };

  ngOnInit() {
      this.http.jsonp('https://trial.mobiscroll.com/events/', 'callback').subscribe((resp: any) => {
          this.events = resp;
      });
  }

  verEventos() {
    this.navCtrl.navigateForward('/eventos');
  }
}
