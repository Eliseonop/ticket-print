import { AfterViewInit, Component, OnInit } from '@angular/core'
import { PrintBluetoothService } from 'app/modules/print-bluetooth/print-bluetooth.service'
import {
    DeviceType,
    PrintGeneralService
} from 'app/modules/print-general/print-general.service'
import {
    InfoDevice,
    PrintUsbService
} from 'app/modules/print-html/print-usb.service'
import { MaterialModule } from 'app/modules/utils/shared/material.module'
import { filter, switchMap, tap } from 'rxjs'
import { MatDialog } from '@angular/material/dialog'
import { PrintGeneralModalComponent } from 'app/modules/print-general/print-general-modal/print-general-modal.component'

@Component({
    selector: 'app-impresora',
    templateUrl: './impresora.component.html',
    styleUrls: ['./impresora.component.css'],
    standalone: true,
    imports: [MaterialModule]
})
export class ImpresoraComponent implements OnInit, AfterViewInit {
    blueEnable = false
    usbEnable = false
    printerInfo: InfoDevice

    constructor (
        public pgs: PrintGeneralService,
        private printUsbService: PrintUsbService,
        private printBluetoothService: PrintBluetoothService,
        private matDialog: MatDialog
    ) {}

    openModalPrint () {
        this.matDialog.open(PrintGeneralModalComponent, {
            autoFocus: false
        })
    }

    ngOnInit () {}

    ngAfterViewInit () {
        this.usbEnable = this.printUsbService.isSupported
        this.blueEnable = this.printBluetoothService.isSupported

        this.pgs.infoDevice
            .pipe(filter((info: InfoDevice) => info !== null))
            .subscribe((info: InfoDevice) => {
                console.log('info', info)
                this.printerInfo = info
            })
        const device = localStorage.getItem('device')
        console.log('device', device)
        if (device === DeviceType.USB) {
            this.printUsbService
                .reconnect()
                .pipe(
                    filter((device: USBDevice) => device !== null),
                    tap((device: USBDevice) => {
                        this.pgs.selectPrinter(
                            this.printUsbService,
                            DeviceType.USB
                        )
                    })
                )
                .subscribe()
        }
        if (device === DeviceType.BLUETOOTH) {
            // setTimeout(() => {
            //     navigator.bluetooth
            //         .getDevices()
            //         .then((devices: BluetoothDevice[]) => {
            //             console.log('devices', devices)
            //             // this.printBluetoothService.devicesVinculados.next(devices)
            //         })
            // }, 5000)
            // this.printBluetoothService
            //     .reconnect()
            //     .pipe(
            //         filter((device: BluetoothDevice) => device !== null),
            //         tap((device: BluetoothDevice) => {
            //             this.pgs.selectPrinter(
            //                 this.printBluetoothService,
            //                 DeviceType.BLUETOOTH
            //             )
            //         })
            //     )
            //     .subscribe()
        }
    }
}
