import { Component, OnInit } from '@angular/core'
import { IMoneda } from 'app/modules/recibo/models/ticket.interface'
import { BehaviorSubject, tap } from 'rxjs'
import { DeviceConnectService } from '../../print-html/devices-conect.service'
import { Printer, WebUSB } from 'escpos-buffer'
@Component({
    selector: 'app-print-escbuffer.view',
    templateUrl: './print-escbuffer.view.component.html',
    styleUrls: ['./print-escbuffer.view.component.scss']
})
export class PrintEscbufferViewComponent implements OnInit {
    isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    device: USBDevice
    private printer: Printer
    constructor (private deviceConnectService: DeviceConnectService) {}

    ngOnInit (): void {
        // this.deviceConnectService.selectedDevice
        //     .pipe(
        //         tap(device => {
        //             this.device = device
        //         })
        //     )
        //     .subscribe()
        // this.deviceConnectService.isConnected.subscribe(isConnected => {
        //     this.isConnected.next(isConnected)
        // })
        // this.deviceConnectService.initializeDevice()
        // this.instancePrinter()
    }

    public async print (): Promise<void> {
        this.printer.write('Hello World')
    }

    async instancePrinter () {
        const device = await navigator.usb.requestDevice({
            filters: []
        })
        const connection = await new WebUSB(device)
        this.printer = await Printer.CONNECT('POS-80', connection)
    }

    public async requestDevice (): Promise<void> {
        this.deviceConnectService.requestDevice().then(() => {
            this.deviceConnectService.initializeDevice()
        })
    }
    toCurrency (value, moneda: IMoneda = null): string {
        if (moneda) {
            return `${moneda.codigo}${value.toFixed(2)}`
        } else {
            return `${value.toFixed(2)}`
        }
    }
}
