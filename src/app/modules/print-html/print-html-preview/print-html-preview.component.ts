import { Component, Input } from '@angular/core'
import {
    ReciboDetalleModel,
    ReciboModel
} from 'app/modules/recibo/models/reciboDetalle.models'
import { StructureData } from '../models/structureData.interface'

@Component({
    selector: 'app-print-html-preview',
    templateUrl: './print-html-preview.component.html',
    styleUrls: ['./print-html-preview.component.scss']
})
export class PrintHtmlPreviewComponent {
    @Input()
    structureData: StructureData
}
