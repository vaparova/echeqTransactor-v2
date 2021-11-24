import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatosCoelsa } from '../models/datosCoelsa';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ComprobantesServiceService {

  img: any;
  pdfObj: any;

  constructor(
    public file: File,
    public fileOpener: FileOpener,
    public platform: Platform
  ) { }


  comprobanteEcheq( echeq: DatosCoelsa, accion: string): void{
    const montoEcheq = echeq.datosEcheq.montoEcheq;
    const montoFormato = new Intl.NumberFormat('en-IN', {minimumFractionDigits: 2}).format(montoEcheq);

    const documento = {
      pageSize: {
        width: 300,
        height: 'auto'
      },
      content: [
        {
         style: 'tableExample',
         table: {
           body: [
                 [
                    {
                               text: 'Echeq Transactor',
                               style: 'titulo1'
                               },
                           ],
             [
               {
                 stack: [
                          {text: [
                                   {text: `${accion} \n\n`, fontSize: 15, italics: true}
                          ]},
                 ],
               },
             ],
             [
               {
                fillColor: '#F0F0F0',
                stack: [
                           {
                             margin: [15, 0, 0, 0],
                             text: [
                           {text: '\nDatos Beneficiario', fontSize: 12, bold: true}
                            ]},
                       {
                       margin: [20, 0, 0, 0],
                       style: 'small',
                       type: 'none',
                     ul: [
                        `Denominación: ${echeq.datosEcheq.beneficiario.nombreBeneficiario}`,
                        `CUIL/ CUIT: ${echeq.datosEcheq.beneficiario.cuilBeneficiario}`,
                     ]
                       },
                       {
                         margin: [15, 0, 0, 0],
                             text: [
                           {text: '\n Datos Echeq', fontSize: 12, bold: true},
                            ]},
                       {
                      margin: [20, 0, 0, 0],
                      style: 'small',
                      type: 'none',
                      ul: [
                        `id Echeq: ${echeq.datosEcheq.idEcheq}`,
                        `Monto Echeq: $${montoFormato}`,
                        `Fecha Emisión: ${echeq.datosEcheq.fechaEmision}`,
                        `Fecha Pago:${echeq.datosEcheq.fechaPago}`,
                        `Motivo: ${echeq.datosEcheq.motivo}`,
                        `Referencia: ${echeq.datosEcheq.referencia}`,
                        `Estado: ${echeq.datosEcheq.estadoEcheq}`
                        ]
                       },
                       {
                         margin: [15, 0, 0, 0],
                             text: [
                           {text: '\n Datos Librador', fontSize: 12, bold: true}
                            ]},
                       {
                      margin: [20, 0, 0, 0],
                      style: 'small',
                      type: 'none',
                      ul: [
                        `Denominación: ${echeq.datosTitularEcheq.denominacion}`,
                        `CUIL/ CUIT: ${echeq.datosTitularEcheq.cuil}`,
                        `CBU: ${echeq.datosCuenta.cbu}`,
                        `Entidad: ${echeq.datosEntidad.nombreEntidad}`,
                        `Sucursal: ${echeq.datosEntidad.nombreSucursal} \n\n`,
                      ]
                    }
                 ],
               },
             ]
           ]
         },
         layout: 'noBorders'
        }
     ],
      styles: {
        titulo1: {
          fontSize: 46,
          bold: true,
          color: '#1C442B',
        },
        subheader: {
          fontSize: 18,
          bold: true
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 9
        }
      }
    };

    this.pdfObj = pdfMake.createPdf(documento);
    this.openfile();
    // this.pdfObj.download();
  }

  openfile(){
    if (this.platform.is('cordova')){
      this.pdfObj.getBuffer( (buffer) => {
        const blob = new Blob([buffer], {type: 'application/pdf'});
        this.file.writeFile(this.file.dataDirectory, 'reporte.pdf', blob, { replace: true}).then( fileEntry => {
          this.fileOpener.open(this.file.dataDirectory + 'reporte.pdf', 'application/pdf');
        });
      });
      return true;
    }
    this.pdfObj.download();
  }

}
