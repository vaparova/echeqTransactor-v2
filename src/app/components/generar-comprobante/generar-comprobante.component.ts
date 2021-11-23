import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-generar-comprobante',
  templateUrl: './generar-comprobante.component.html',
  styleUrls: ['./generar-comprobante.component.scss'],
})
export class GenerarComprobanteComponent implements OnInit {
  img: any;
  pdfObj: any;
  variable1 = 'Esto es el contenido de una variable';

  constructor() { }

  ngOnInit() {}

  pruebaPDF(): void{
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
                                   {text: 'Comprobante de Libramiento\n\n', fontSize: 15, italics: true}
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
                           {text: '\nDatos Beneficiario', fontSize: 14, bold: true}
                            ]},
                       {
                       margin: [25, 0, 0, 0],
                       type: 'none',
                     ul: [
                        'Molina Martin Adrian',
                        '20277852536',
                     ]
                       },
                       {
                         margin: [15, 0, 0, 0],
                             text: [
                           {text: '\n Datos Echeq', fontSize: 14, bold: true},
                            ]},
                       {
                      margin: [25, 0, 0, 0],
                      type: 'none',
                      ul: [
                        'ID: AER8921563RT',
                        'Importe: $40.000',
                        'Fecha Pago: 12/12/2021',
                        'Motivo: FAC ',
                        'Referencia: Pago',
                        ]
                       },
                       {
                         margin: [15, 0, 0, 0],
                             text: [
                           {text: '\n Datos Librador', fontSize: 14, bold: true}
                            ]},
                       {
                      margin: [25, 0, 0, 0],
                      type: 'none',
                      ul: [
                        'Vanesa Romero',
                        '2736418380',
                        '011 - Banco Nacion',
                        '285 - Godoy Cruz',
                        '285000370\n\n'
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
          fontSize: 8
        }
      }
    };

    this.pdfObj = pdfMake.createPdf(documento);
    this.pdfObj.download();
  }

  generarPDF(): void{
    const data = document.getElementById('contenido');
    const opciones = {
      background: 'white',
      scale: 3
      };
    const doc = new jsPDF('p', 'pt', 'a6');
    html2canvas(data, opciones).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, '', 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`${new Date().toISOString()}_EcheqTransactor.pdf`);
    });
  }
}
