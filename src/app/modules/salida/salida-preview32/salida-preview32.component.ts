import { Component, Input, OnInit } from '@angular/core'
import { SalidaPos } from '../utils/salidaData.interface'

@Component({
    selector: 'app-salida-preview32',
    templateUrl: './salida-preview32.component.html',
    styleUrls: ['./salida-preview32.component.scss']
})
export class SalidaPreview32Component implements OnInit {
    @Input() structureData: SalidaPos

    constructor () {}

    ngOnInit () {}
}
