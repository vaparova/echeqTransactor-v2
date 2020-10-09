import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sector-mi-cuenta',
  templateUrl: './sector-mi-cuenta.page.html',
  styleUrls: ['./sector-mi-cuenta.page.scss'],
})
export class SectorMiCuentaPage implements OnInit {
  index: any;
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( data => {
      this.index = Number(Object.values(data).toString());
      console.log(this.index);
    });
   }

  ngOnInit() {
  }

}
