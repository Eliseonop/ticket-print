import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PrintGeneralModalComponent } from '../print-general-modal/print-general-modal.component'
import { PrintGeneralService } from '../print-general.service'

@Component({
    selector: 'app-print-general-main',
    templateUrl: './print-general-main.component.html',
    styleUrls: ['./print-general-main.component.scss']
})
export class PrintGeneralMainComponent {
    constructor (public pgs: PrintGeneralService, public matDialog: MatDialog) {}

    openModal () {
        this.matDialog.open(PrintGeneralModalComponent, {
            autoFocus: false
        })
    }
}
