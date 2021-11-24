import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import { DatosCoelsa } from '../../models/datosCoelsa';
import { DatosBeneficiario } from '../../models/datosBeneficiario';
import { ComprobantesServiceService } from '../../providers/comprobantes-service.service';

@Component({
  selector: 'app-echeq-librados',
  templateUrl: './echeq-librados.component.html',
  styleUrls: ['./echeq-librados.component.scss'],
})
export class EcheqLibradosComponent implements OnInit {

  vacio = false;
  echeqs: DatosCoelsa[] = [];
  vistaEcheqs: DatosCoelsa[] = [];
  echeq: DatosCoelsa;
  estado = 'Emitido - Pendiente';
  verMenu = true;
  verListado = true;
  verEcheq = false;
  datosEcheq = false;
  datosCuenta = false;
  datosBeneficiario = false;


  constructor(private user: UsuariosService,
              public actionSheetController: ActionSheetController,
              private cmprbte: ComprobantesServiceService) {
    this.echeqs = this.user.buscarEcheqCoelsa(27364183807);
    setTimeout( () => {
      this.filtrarEcheqs('Emitido - Pendiente');
    }, 2000);
  }

  ngOnInit() {}

  segmentChanged(ev: any) {
    const estado = ev.detail.value.toString();
    this.estado = estado;
    this.filtrarEcheqs(estado);
  }

  detalleEcheq(ev: any){
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

  volver(){
    this.modificarVista(true, true, false);
    this.verDetalleEcheq(false, false, false);
  }

  private filtrarEcheqs(estado: string){
    this.vistaEcheqs = [];

    if ( estado === 'Emitido - Pendiente'){
      Object.values(this.echeqs).forEach( (echeq) => {
        if (echeq.datosEcheq.estadoEcheq === estado || echeq.datosEcheq.estadoEcheq === 'Activo' ){
          this.vistaEcheqs.push(echeq);
        }
      });
    }else{
      Object.values(this.echeqs).forEach( (echeq) => {
        if (echeq.datosEcheq.estadoEcheq === estado){
          this.vistaEcheqs.push(echeq);
        }
      });
    }

    this.arrayVacio();
  }

  private arrayVacio(){
    if (this.vistaEcheqs.length < 1){
      this.vacio = true;
    }else{
      this.vacio = false;
    }
  }
  private modificarVista(verMenu: boolean, verListado: boolean, verEcheq: boolean){
    this.verMenu = verMenu;
    this.verListado = verListado;
    this.verEcheq = verEcheq;
  }

  private verDetalleEcheq(datosEcheq: boolean, datosCuenta: boolean, datosBeneficiario: boolean){
    this.datosEcheq = datosEcheq;
    this.datosCuenta = datosCuenta;
    this.datosBeneficiario = datosBeneficiario;
  }

  async presentActionSheetEmitidos(i: number): Promise<void> {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      mode: 'md',
      buttons: [ {
        text: 'Ver Datos',
        icon: 'eye-outline',
        handler: () => {
          this.modificarVista(false, false, true);
          this.verDetalleEcheq(true, false, false);
          this.echeq = this.vistaEcheqs[i];
          console.log(this.echeq);
        }
      }, {
        text: 'Descargar Comprobante ',
        role: 'destructive',
        icon: 'cloud-download-outline',
        handler: () => {
          this.echeq = this.vistaEcheqs[i];
          this.cmprbte.comprobanteEcheq(this.echeq, 'Constancia de Libramiento Echeq');
        },
      }, {
        text: 'Anular Echeq ',
        role: 'destructive',
        icon: 'trash-outline',
        handler: () => {
          // this.echeq = this.echeqs[i];
          // this.crearFormaEcheq();
          // this.setFormaEcheq();
          // this.modificarVista(false, false, false, true);
          // console.log(this.echeq);
        },
      }
      ]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private anularEcheq(){
    console.log('Anulando Echeq');
  }

}
