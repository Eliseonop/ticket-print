import { Component, OnInit } from '@angular/core'
import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver'
import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print'
import { NgxPrinterService } from 'ngx-printer'
import { tap } from 'rxjs'
@Component({
    selector: 'app-thermal-print-list',
    templateUrl: './thermal-print-list.component.html',
    styleUrls: ['./thermal-print-list.component.scss']
})
export class ThermalPrintListComponent {
    status: boolean = false
    usbPrintDriver: UsbDriver
    webPrintDriver: WebPrintDriver
    ip: string = '10.83.118.160'

    constructor (
        private printService: PrintService,

        private printerService: NgxPrinterService
    ) {
        // this.printerService.printAngular()

        this.usbPrintDriver = new UsbDriver()

        this.printService.isConnected.subscribe(result => {
            this.status = result
            if (result) {
                console.log('Connected to printer!!!')
            } else {
                console.log('Not connected to printer.')
            }
        })
    }

    async requestUsb () {
        // native request
        // const list = await window.navigator.usb.requestDevice({ filters: [] })

        // await list.claimInterface

        // Abre el puerto serie
        // const port = await navigator.serial.requestPort()

        // Abre la conexión con el puerto
        // const writer = port.writable.getWriter()
        // console.log('list', list)
        this.usbPrintDriver
            .requestUsb()
            .pipe(tap(a => console.log('USB Connected', a)))
            .subscribe(() => {
                this.printService.setDriver(this.usbPrintDriver, 'ESC/POS')
                console.log(this.printService.isConnected)
            })
    }

    connectToWebPrint () {
        this.webPrintDriver = new WebPrintDriver(this.ip)
        this.printService.setDriver(this.webPrintDriver, 'WebPRNT')
    }

    print () {
        this.printService
            .init()
            .setBold(true)
            .writeLine('Hello World!')
            .setBold(false)
            .feed(4)
            .cut('full')
            .flush()
    }
}
function isChrome () {
    return navigator.userAgent.indexOf('Chrome') > -1
}
