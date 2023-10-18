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
        this.pgs.selectPrinter(DeviceType.USB)

        this.pgs.requestDevice().subscribe((device: boolean) => {
            console.log('device', device)
        })
    }

    requestDeviceBluetooth () {
        this.pgs.selectPrinter(DeviceType.BLUETOOTH)

        this.pgs.requestDevice().subscribe((device: boolean) => {
            console.log('device', device)
        })
    }

    ngOnInit (): void {
        this.usbEnable = this.printUsbService.isSupported
        this.blueEnable = this.printBluetoothService.isSupported

        // this.pgs.deviceType.subscribe((deviceType: DeviceType) => {
        //     console.log('deviceType', deviceType)
        //     this.deviceType = deviceType
        // })

        console.log('this.usbEnable')
        this.pgs.deviceType
            .pipe(
                filter(
                    device =>
                        device === DeviceType.USB ||
                        device === DeviceType.BLUETOOTH
                ),
                switchMap(() => {
                    console.log('device', this.pgs.deviceType.value)
                    return this.pgs.getInformation()
                }),
                tap((infoDevice: InfoDevice) => {
                    console.log('infoDevice', infoDevice)
                    this.printerInfo = infoDevice
                }),
                switchMap(() => {
                    return this.pgs.getProgress()
                }),
                tap((process: string) => {
                    console.log('process', process)
                    this.process = process
                })
            )
            .subscribe()

        // this.pgs.process.subscribe((process: string) => {
        //     console.log('process', process)
        //     this.process = process
        // })
    }

    selectNone () {
        this.pgs.selectNoneAndDisconnect()
    }

    ngAfterViewInit (): void {}
}
