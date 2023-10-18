import { HttpClient } from '@angular/common/http'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { Injectable } from '@angular/core'
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { InfoDevice } from '../print-html/print-usb.service'
import { DeviceType } from '../print-general/print-general.service'

// import {} from ''

pdfMake.vfs = pdfFonts.pdfMake.vfs

@Injectable({
    providedIn: 'root'
})
export class PdfService {
    process = new BehaviorSubject<string>(
        'Al momento de imprimir se abrirá una nueva pestaña con el PDF...'
    )
    infoDevice = new BehaviorSubject<InfoDevice>(null)

    constructor (private http: HttpClient) {}
    disconnect (): void {
        this.infoDevice.next(null)
    }
    write (docDefinition: TDocumentDefinitions) {
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

    reconectar (): Observable<boolean> {
        return new Observable(observer => {
            this.infoDevice.next(this.getInformation())
            return observer.next(true)
        })
    }

    resetService (): void {
        this.infoDevice.next(null)
        this.process.next('')
        localStorage.removeItem('device')
    }

    requestDevice (): Observable<string> {
        return new Observable(observer => {
            this.infoDevice.next(this.getInformation())
            return observer.next('PDF')
        })
    }

    connect (): Observable<boolean> {
        return new Observable(observer => {
            this.infoDevice.next(this.getInformation())
            return observer.next(true)
        })
    }

    getInformation (): InfoDevice {
        return {
            productName: 'PDF',
            name: 'PDF',
            estado: true,
            type: DeviceType.PDF
        }
    }
}
