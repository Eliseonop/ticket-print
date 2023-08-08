import { HttpClient } from '@angular/common/http'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Injectable } from '@angular/core'
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { Observable, tap } from 'rxjs'

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({
    providedIn: 'root'
})
export class PdfService {
    constructor (private http: HttpClient) {}

    styles = {
        header: {
            fontSize: 18,
            bold: true,
            marginBottom: 10
        },
        subheader: {
            fontSize: 14,
            bold: true,
            marginBottom: 5
        },
        listItem: {
            fontSize: 12,
            marginBottom: 3
        },
        total: {
            fontSize: 14,
            bold: true,
            marginTop: 10
        }
    }

    generateAndOpenPdf (docDefinition: TDocumentDefinitions) {
        // const content: Content = [
        //     {
        //         text: 'Recibo de pago',
        //         style: 'header',
        //         alignment: 'center'
        //     },
        //     {
        //         text: 'Datos del cliente',
        //         style: 'subheader',
        //         alignment: 'center'
        //     },
        //     {
        //         columns: [
        //             {
        //                 text: 'Nombre:',
        //                 width: 100
        //             },
        //             {
        //                 text: 'Nombre del cliente',
        //                 width: '*'
        //             }
        //         ],
        //         style: 'listItem'
        //     },
        //     {
        //         columns: [
        //             {
        //                 text: 'Dirección:',
        //                 width: 100
        //             },
        //             {
        //                 text: 'Dirección del cliente',
        //                 width: '*'
        //             }
        //         ],
        //         style: 'listItem'
        //     }
        // ]

        // const docDefinition: TDocumentDefinitions = {
        //     pageSize: { width: 225, height: 'auto' },
        //     pageOrientation: 'portrait',
        //     content: content,
        //     pageMargins: [40, 40, 40, 40],
        //     styles: this.styles,
        //     defaultStyle: {},
        //     images: {}
        // }

        // // Para abrir el PDF en una nueva pestaña
        pdfMake.createPdf(docDefinition).open()
    }

    // pdfBoletaLook (): Observable<Blob> {
    //     const url = 'URL_DEL_ARCHIVO_PDF' // Reemplaza por la URL correcta del archivo PDF

    //     return this.http.get(url, { responseType: 'blob' }).pipe(
    //         tap(res => {
    //             const file = new Blob([res], {
    //                 type: 'application/pdf'
    //             })
    //             const fileURL = window.URL.createObjectURL(file)

    //             window.open(fileURL, '_blank')
    //         })
    //     )
    // }
}
