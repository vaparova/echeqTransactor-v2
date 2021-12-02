import { DatosEcheq } from './../models/datosEcheq';
import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DatosCoelsa } from '../models/datosCoelsa';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import { DatosRechazo } from '../models/datosRechazo';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class ComprobantesServiceService {

  img: any;
  pdfObj: any;
  fecha: Date;
  denEndoso = ' - ';
  cuilEndoso = ' - ';
  cbuDep = ' - ';

  constructor(
    public file: File,
    public fileOpener: FileOpener,
    public platform: Platform
  ) {  }


  comprobanteEcheq( echeq: DatosCoelsa, accion: string): void{
    this.fecha = new Date();
    const montoEcheq = echeq.datosEcheq.montoEcheq;
    const montoFormato = new Intl.NumberFormat('en-IN', {minimumFractionDigits: 2}).format(montoEcheq);

    this.denEndoso = ' - ';
    this.cuilEndoso = ' - ';
    this.cbuDep = ' - ';
    if (echeq.datosEcheq.endososEcheq){
      if (echeq.datosEcheq.endososEcheq.length > 0){
        const idx = echeq.datosEcheq.endososEcheq.length - 1;
        this.denEndoso = echeq.datosEcheq.endososEcheq[idx].endosatario.nombreBeneficiario;
        this.cuilEndoso = echeq.datosEcheq.endososEcheq[idx].endosatario.cuilBeneficiario.toString();
        if (echeq.datosEcheq.endososEcheq[idx].endosatario.datosCuenta){
          this.cbuDep = echeq.datosEcheq.endososEcheq[idx].endosatario.datosCuenta.cbu;
        }
      }
    }


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
                      {text: '\n Datos Tenedor', fontSize: 12, bold: true},
                       ]},
                  {
                 margin: [20, 0, 0, 0],
                 style: 'small',
                 type: 'none',
                 ul: [
                   `Denominación: ${this.denEndoso}`,
                   `CUIL/ CUIT: ${this.cuilEndoso}`,
                   `CBU Depósito: ${this.cbuDep}`,
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
                    }, {
                      margin: [15, 0, 0, 0],
                      text: [
                    {text: 'Datos Beneficiario', fontSize: 12, bold: true}
                     ]},
                {
                margin: [20, 0, 0, 0],
                style: 'small',
                type: 'none',
              ul: [
                 `Denominación: ${echeq.datosEcheq.beneficiario.nombreBeneficiario}`,
                 `CUIL/ CUIT: ${echeq.datosEcheq.beneficiario.cuilBeneficiario}\n\n`,
              ]
                },
                 ],
               },
             ],
             [
              {
                stack: [
                         {text: [
                      {text: `\n\nFecha y Hora de Generación: ${this.fecha} - Echeq Transactor App Mobile \n\n`, fontSize: 8, italics: true}
                         ]},
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
  comprobanteEcheqCAC( echeq: DatosCoelsa, accion: string): void{
    this.fecha = new Date();
    const montoEcheq = echeq.datosEcheq.montoEcheq;
    const montoFormato = new Intl.NumberFormat('en-IN', {minimumFractionDigits: 2}).format(montoEcheq);

    this.denEndoso = ' - ';
    this.cuilEndoso = ' - ';
    this.cbuDep = ' - ';
    if (echeq.datosEcheq.endososEcheq){
      if (echeq.datosEcheq.endososEcheq.length > 0){
        const idx = echeq.datosEcheq.endososEcheq.length - 1;
        this.denEndoso = echeq.datosEcheq.endososEcheq[idx].endosatario.nombreBeneficiario;
        this.cuilEndoso = echeq.datosEcheq.endososEcheq[idx].endosatario.cuilBeneficiario.toString();
        if (echeq.datosEcheq.endososEcheq[idx].endosatario.datosCuenta){
          this.cbuDep = echeq.datosEcheq.endososEcheq[idx].endosatario.datosCuenta.cbu;
        }
      }
    }
    console.log(echeq.datosEcheq.datosRechazo);
    const idxRech = echeq.datosEcheq.datosRechazo.length - 1;
    const datosRechazo = echeq.datosEcheq.datosRechazo[idxRech];


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
                      {text: '\n Datos Tenedor', fontSize: 12, bold: true},
                       ]},
                  {
                 margin: [20, 0, 0, 0],
                 style: 'small',
                 type: 'none',
                 ul: [
                   `Denominación: ${this.denEndoso}`,
                   `CUIL/ CUIT: ${this.cuilEndoso}`,
                   `CBU Depósito: ${this.cbuDep}`,
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
                       }, {
                        margin: [15, 0, 0, 0],
                            text: [
                          {text: '\n Datos Rechazo', fontSize: 12, bold: true},
                           ]},
                      {
                     margin: [20, 0, 0, 0],
                     style: 'small',
                     type: 'none',
                     ul: [
                       `Código Rechazo: ${datosRechazo.codigoRechazo}`,
                       `Motivo Rechazo: ${datosRechazo.motivoRechazo}`,
                       `Fecha Rechazo: ${datosRechazo.fechaRechazo}`,
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
                    }, {
                      margin: [15, 0, 0, 0],
                      text: [
                    {text: 'Datos Beneficiario', fontSize: 12, bold: true}
                     ]},
                {
                margin: [20, 0, 0, 0],
                style: 'small',
                type: 'none',
              ul: [
                 `Denominación: ${echeq.datosEcheq.beneficiario.nombreBeneficiario}`,
                 `CUIL/ CUIT: ${echeq.datosEcheq.beneficiario.cuilBeneficiario}\n\n`,
              ]
                },
                 ],
               },
             ],
             [
              {
                stack: [
                         {text: [
                      {text: `\n\nFecha y Hora de Generación: ${this.fecha} - Echeq Transactor App Mobile \n\n`, fontSize: 8, italics: true}
                         ]},
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
