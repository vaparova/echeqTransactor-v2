import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.page.html',
  styleUrls: ['./alerta.page.scss'],
})
export class AlertaPage implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( data => console.log(data));
  }

  ngOnInit() {
  }

}
