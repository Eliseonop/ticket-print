import { Component, OnInit } from '@angular/core'
import { PdfService } from '../pdf.service'
import { TicketService } from '../ticket.service'
import { TDocumentDefinitions } from 'pdfmake/interfaces'

@Component({
    selector: 'app-recibo-view',
    templateUrl: './recibo-view.component.html',
    styleUrls: ['./recibo-view.component.scss']
})
export class ReciboViewComponent implements OnInit {
    ticketDefinition: TDocumentDefinitions

    constructor (
        private pdfService: PdfService,
        private ticketService: TicketService
    ) {}

    ngOnInit (): void {
        this.ticketService.getTicketData().subscribe(data => {
            console.log('data', data)

            this.ticketDefinition = this.ticketService.getTicketDefinition(data)
        })
    }

    generateTicket () {
        console.log('Generando ticket')
        this.pdfService.generateAndOpenPdf(this.ticketDefinition)
    }
}
