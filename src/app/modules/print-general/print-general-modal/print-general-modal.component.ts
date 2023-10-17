import { AfterViewInit, Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { DeviceType, PrintGeneralService } from '../print-general.service'
import { filter, switchMap, tap } from 'rxjs'
import {
    InfoDevice,
    PrintUsbService
} from 'app/modules/print-html/print-usb.service'
import { PrintBluetoothService } from '../../print-bluetooth/print-bluetooth.service'

@Component({
    selector: 'app-print-general-modal',
    templateUrl: './print-general-modal.component.html',
    styleUrls: ['./print-general-modal.component.scss']
})
export class PrintGeneralModalComponent implements OnInit, AfterViewInit {
    blueEnable = false
    usbEnable = false
    printerInfo: InfoDevice
    process: string

    deviceType: DeviceType
    constructor (
        private printUsbService: PrintUsbService,
        private printBluetoothService: PrintBluetoothService,
        private _matDialogRef: MatDialogRef<PrintGeneralService>,
        public pgs: PrintGeneralService
    ) {}

    closeModal () {
        this._matDialogRef.close()
    }

    requestDeviceUsb () {
        this.printUsbService
            .requestDevice()
            .pipe(
                tap((device: USBDevice) => {
                    console.log('Dispositivo seleccionado:', device)
                    this.pgs.selectPrinter(this.printUsbService, DeviceType.USB)
                })
            )
            .subscribe()
    }

    requestDeviceBluetooth () {
        this.printBluetoothService
            .requestDevice()
            .pipe(
                tap((device: BluetoothDevice) => {
                    console.log('Dispositivo seleccionado:', device)
                    this.pgs.selectPrinter(
                        this.printBluetoothService,
                        DeviceType.BLUETOOTH
                    )
                })
            )
            .subscribe()
    }

    ngOnInit (): void {
        this.pgs.deviceType.subscribe((deviceType: DeviceType) => {
            this.deviceType = deviceType
        })

        this.usbEnable = this.printUsbService.isSupported
        this.blueEnable = this.printBluetoothService.isSupported
        console.log('this.usbEnable')
        this.pgs.infoDevice
            .pipe(filter((info: InfoDevice) => info !== null))
            .subscribe((info: InfoDevice) => {
                console.log('info', info)
                this.printerInfo = info
            })

        this.pgs.process.subscribe((process: string) => {
            this.process = process
        })
    }

    selectNone () {
        this.pgs.selectedNone()
        // this.pgs.servicePrinter = null
    }

    ngAfterViewInit (): void {}
}
