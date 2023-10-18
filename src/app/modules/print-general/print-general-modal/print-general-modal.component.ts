import { AfterViewInit, Component, OnInit } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import {
    DeviceType,
    PrintGeneralService,
    WithPrint
} from '../print-general.service'
import { filter, switchMap, tap } from 'rxjs'
import {
    InfoDevice,
    PrintUsbService
} from 'app/modules/print-html/print-usb.service'
import { PrintBluetoothService } from '../../print-bluetooth/print-bluetooth.service'
import { FormBuilder } from '@angular/forms'

@Component({
    selector: 'app-print-general-modal',
    templateUrl: './print-general-modal.component.html',
    styleUrls: ['./print-general-modal.component.scss']
})
export class PrintGeneralModalComponent implements OnInit, AfterViewInit {
    opcionesForm = this.fb.group({
        withPrint: [null as WithPrint]
    })

    blueEnable = false
    usbEnable = false
    printerInfo: InfoDevice
    process: string

    deviceType: DeviceType

    constructor (
        private printUsbService: PrintUsbService,
        private printBluetoothService: PrintBluetoothService,
        private _matDialogRef: MatDialogRef<PrintGeneralService>,
        public pgs: PrintGeneralService,
        public fb: FormBuilder
    ) {}
    ngOnInit (): void {
        this.opcionesForm.valueChanges.subscribe(value => {
            // console.log('value', value.withPrint as WithPrint)
            console.log('value', value.withPrint)
            this.pgs.withPrint.next(value.withPrint)
        })

        this.usbEnable = this.printUsbService.isSupported
        this.blueEnable = this.printBluetoothService.isSupported

        console.log('this.usbEnable')
        this.pgs.deviceType
            .pipe(
                filter(device => device !== null && device !== undefined),
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
    }
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

    requestDevicePdf () {
        this.pgs.selectPrinter(DeviceType.PDF)

        this.pgs.requestDevice().subscribe((device: boolean) => {
            console.log('device', device)
        })
    }

    selectNone () {
        this.pgs.selectNoneAndDisconnect()
    }

    ngAfterViewInit (): void {}
}
