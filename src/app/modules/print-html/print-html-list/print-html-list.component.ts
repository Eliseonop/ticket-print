import { Component, ElementRef, ViewChild } from '@angular/core'
import EscPosEncoder from 'esc-pos-encoder'
@Component({
    selector: 'app-print-html-list',
    templateUrl: './print-html-list.component.html',
    styleUrls: ['./print-html-list.component.scss']
})
export class PrintHtmlListComponent {
    decodedTicketContent: string = ''
    constructor () {}
    async start () {}
    async connectSerial () {}
    async print () {
        const device = await navigator.usb.requestDevice({ filters: [] })

        // const device = devices[0]
        console.log('Device: ', device)
        await device.open().then(a => {
            console.log(a)
        })
        const textToPrint = 'Hello, World!\n'
        const encoder = new TextEncoder()
        const data = encoder.encode(textToPrint)
        await device.transferOut(1, data)
        await device.selectConfiguration(1)
        await device.claimInterface(
            device.configuration.interfaces[0].interfaceNumber
        )
        // const data = await device.transferIn(1, 64)
        console.log('DATA: ', data)
        // device.transferOut(1, this.encodedImage)
    }

    imprimir () {
        let encoder = new EscPosEncoder()
        let img = new Image()
        img.src =
            'https://i0.wp.com/imgs.hipertextual.com/wp-content/uploads/2017/07/rick-morty-.jpg?fit=1920%2C1080&quality=50&strip=all&ssl=1'

        const printer = encoder.initialize()

        try {
            // Configurar conexión con la impresora
            // Por ejemplo, printer.device('network'); printer.connect('IP_DE_LA_IMPRESORA');
            // const devices = print.

            let result = printer
                .initialize()
                .codepage('windows1253')
                .text('The quick brown fox jumps over the lazy dog')
                .newline()
                .table(
                    [
                        { width: 36, marginRight: 2, align: 'left' },
                        { width: 10, align: 'right' }
                    ],
                    [
                        ['Item 1', '€ 10,00'],
                        ['Item 2', '15,00'],
                        ['Item 3', '9,95'],
                        ['Item 4', '4,75'],
                        ['Item 5', '211,05'],
                        ['', '='.repeat(10)],
                        [
                            'Total',
                            encoder => encoder.bold().text('€ 250,75').bold()
                        ]
                    ]
                )
                .barcode('123456789012', 'ean13', 60)
                .newline()
                .qrcode('https://nielsleenheer.com')
                .align('center')
                .image(img, 320, 320)
                .cut('full')
                .encode()

            this.decodedTicketContent = new TextDecoder('utf-8').decode(result)
            console.log('Impresión exitosa', result)
        } catch (error) {
            console.error('Error al imprimir', error)
        }
    }
}
