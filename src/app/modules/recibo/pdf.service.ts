import { HttpClient } from '@angular/common/http'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Injectable } from '@angular/core'
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { Observable, tap } from 'rxjs'
import { InfoDevice } from '../print-html/print-usb.service'
import { DeviceType } from '../print-general/print-general.service'

// import {} from ''

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({
    providedIn: 'root'
})
export class PdfService {
    constructor (private http: HttpClient) {}

    generateAndOpenPdf (docDefinition: TDocumentDefinitions) {
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
                normal: `${window.location.origin}/assets/fonts/roboto-mono/RobotoMono-Regular.woff`,
                bold: `${window.location.origin}/assets/fonts/roboto-mono/RobotoMono-Regular.woff`,
                italics: `${window.location.origin}/assets/fonts/roboto-mono/RobotoMono-Regular.woff`,
                bolditalics: `${window.location.origin}/assets/fonts/roboto-mono/RobotoMono-Regular.woff`
            }
        }

        // // Para abrir el PDF en una nueva pestaña
        pdfMake.createPdf(docDefinition).open()
    }

    getInformation (): InfoDevice {
        return {
            productName: 'PDF',
            name: 'PDF',
            estado: true,
            type: DeviceType.PDF
        }
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
