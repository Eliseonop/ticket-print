import { Component, Input } from '@angular/core'
import {
    ReciboDetalleModel,
    ReciboModel
} from 'app/modules/recibo/models/ticket.models'

@Component({
    selector: 'app-print-html-preview',
    templateUrl: './print-html-preview.component.html',
    styleUrls: ['./print-html-preview.component.scss']
})
export class PrintHtmlPreviewComponent {
    @Input()
    recibo: ReciboDetalleModel

    // calculateContainerWidth (printerType: string): string {
    //     const paperWidthInInches = printerType === 'pos-80' ? 3.15 : 2.28 // Adjust values for different printer types
    //     const dpi = 203 // Resolution in dpi
    //     const widthInPixels = Math.round(paperWidthInInches * dpi)
    //     return `${widthInPixels}px`
    // }
    mmToPixels (mm: number): string {
        const pixelsPerMm = 3.78
        return mm * pixelsPerMm + 'px'
    }
    transformDate (date: Date): string {
        // 2023-07-27T10:25:20.958149-05:00"
        const fecha = new Date(date)
        //  esta fecha lucira asi 27/7/2023 con hora 10:25:20
        return `${fecha.getDate()}/${
            fecha.getMonth() + 1
        }/${fecha.getFullYear()}  ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`
    }
}
