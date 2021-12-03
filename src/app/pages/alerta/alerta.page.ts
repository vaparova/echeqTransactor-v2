import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertasService } from '../../providers/alertas.service';
import { Notificacion } from '../../models/notificacion.model';
import { DatosAlertas } from '../../models/datosAlertas';
import { DatosSesion } from 'src/app/models/datosSesion';
import { DatosUsuario } from 'src/app/models/datosUsuario';
import { UsuariosService } from '../../providers/usuarios.service';
import { ToastsService } from '../../providers/toasts.service';
import { NavController } from '@ionic/angular';
import { DatosBeneficiario } from '../../models/datosBeneficiario';

@Component({
  selector: 'app-alerta',
  templateUrl: './alerta.page.html',
  styleUrls: ['./alerta.page.scss'],
})
export class AlertaPage implements OnInit {
  alerta: DatosAlertas;
  index: number;
  sesion: DatosSesion;
  usuario: DatosUsuario;
  tenedor: DatosBeneficiario;
  indexEndoso: number;
  datosEcheq = false;
  datosCuenta = false;
  datosBeneficiario = false;

  constructor(private route: ActivatedRoute, private alts: AlertasService,
              private user: UsuariosService, private toast: ToastsService,
              private navCtrl: NavController) {
    this.obtenerData();
    this.route.params.subscribe( data => {
      this.index = Number(Object.values(data).toString());
      this.alerta = this.usuario.usuario.datosAlertas[this.index];
      this.indexEndoso = this.alerta.echeq.datosEcheq.endososEcheq.length - 1;
      this.tenedor = this.alerta.echeq.datosEcheq.endososEcheq[this.indexEndoso].endosatario;
      console.log(this.tenedor);
    });
    this.verDetalleEcheq(true, false, false);

  }

  ngOnInit() {
  }

  private obtenerData(): void{
    const a = this.user.validarSesion();
    if (a){
      this.sesion = a;
      this.usuario = this.user.obtenerUsuario(this.sesion.cuil);
      console.log(`respta obtenerUsuario() US: ${this.usuario}`);
      console.log(this.usuario);
    }else{
      this.user.borrarSesion();
      this.toast.mostrarToast('Debes iniciar sesión', 'danger');
      this.navCtrl.navigateBack('/ingreso');
      console.log('error de login!');
    }
  }

  detalleEcheq(ev: any): void{
    const estado = ev.detail.value.toString();
    switch (estado){
      case 'datosEcheq':
        this.verDetalleEcheq(true, false, false);
        break;
      case 'datosCuenta':
        this.verDetalleEcheq(false, true, false);
        break;
      case 'datosBeneficiario':
        this.verDetalleEcheq(false, false, true);
        break;
    }
  }

  private verDetalleEcheq(datosEcheq: boolean, datosCuenta: boolean, datosBeneficiario: boolean): void{
    this.datosEcheq = datosEcheq;
    this.datosCuenta = datosCuenta;
    this.datosBeneficiario = datosBeneficiario;
  }
}
