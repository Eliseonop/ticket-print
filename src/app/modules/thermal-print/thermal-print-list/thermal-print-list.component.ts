import { Component, OnInit } from '@angular/core'
import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver'
import { PrintService, UsbDriver, WebPrintDriver } from 'ng-thermal-print'
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
    devices: USBDevice[] = []
    selectedDevice: USBDevice | undefined

    vendorId: number = 0x0483
    productId: number = 0x5740
    endPoint: any
    private device: USBDevice
    constructor (private printService: PrintService) {
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
        this.listUsbDevices()
    }
    onSelectDevice (device: USBDevice) {
        this.selectedDevice = device
    }
    async listUsbDevices () {
        try {
            const usbDevices = await navigator.usb.getDevices()
            this.devices = usbDevices

            console.log('Devices: ', usbDevices)
        } catch (error) {
            console.error('Error listing USB devices:', error)
        }
    }

    async requestUsb () {
        this.usbPrintDriver
            .requestUsb()
            .pipe(tap(a => console.log('USB Connected', a)))
            .subscribe(() => {
                this.printService.setDriver(this.usbPrintDriver, 'ESC/POS')
                console.log(this.printService.isConnected)
            })
    }

    print () {
        this.printService
            .init()
            .setBold(true)
            .writeLine('Hello World!')
            .writeLine('Hello World!')
            .writeLine('Hello World!')
            .writeLine('Hello World!')
            .writeLine('Hello World!')

            .setBold(false)
            .feed(4)
            .cut('full')
            .flush()
    }
}
