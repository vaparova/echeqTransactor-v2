import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatosCoelsa } from '../models/datosCoelsa';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ComprobantesServiceService {

  img: any;
  pdfObj: any;

  constructor() { }


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
    this.pdfObj.download();
  }

}
