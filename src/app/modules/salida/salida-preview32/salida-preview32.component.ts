import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-salida-preview32',
    templateUrl: './salida-preview32.component.html',
    styleUrls: ['./salida-preview32.component.scss']
})
export class SalidaPreview32Component implements OnInit {
    @Input() structureData: any

    constructor () {}

    ngOnInit () {}
}
