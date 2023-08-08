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

    generateAndOpenPdf (docDefinition: TDocumentDefinitions) {
        // const docDefinition: TDocumentDefinitions = {
        //     pageSize: { width: 225, height: 'auto' },
        //     pageOrientation: 'portrait',
        //     content: content,
        //     pageMargins: [40, 40, 40, 40],
        //     styles: this.styles,
        //     defaultStyle: {},
        //     images: {}
        // }
        pdfMake.fonts = {
            JetBrains: {
                normal: 'https://fonts.cdnfonts.com/s/98875/JetBrainsMonoRegular.woff',
                bold: 'https://fonts.cdnfonts.com/s/98875/JetBrainsMonoBold.woff',
                italics:
                    'https://fonts.cdnfonts.com/s/98875/JetBrainsMonoItalic.woff',
                bolditalics:
                    'https://fonts.cdnfonts.com/s/98875/JetBrainsMonoBoldItalic.woff'
            },
            RobotoMono: {
                normal: 'https://fonts.cdnfonts.com/s/16061/RobotoMono-Regular.woff',
                bold: 'https://fonts.cdnfonts.com/s/16061/RobotoMono-Bold.woff',
                italics:
                    'https://fonts.cdnfonts.com/s/16061/RobotoMono-MediumItalic.woff',
                bolditalics:
                    'https://fonts.cdnfonts.com/s/16061/RobotoMono-BoldItalic.woff'
            }
        }

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
