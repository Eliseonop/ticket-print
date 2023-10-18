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
import { debounce, debounceTime, filter, switchMap, tap } from 'rxjs'
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

    ngOnInit () {
        this.pgs.deviceType
            .pipe(
                filter(device => device !== null && device !== undefined),
                debounceTime(10),
                switchMap(() => {
                    console.log('device', this.pgs.deviceType.value)
                    return this.pgs.getInformation()
                }),
                tap(info => {
                    this.printerInfo = info
                })
            )
            .subscribe()
    }

    ngAfterViewInit () {
        this.usbEnable = this.printUsbService.isSupported
        this.blueEnable = this.printBluetoothService.isSupported

        const device = localStorage.getItem('device')

        if (device === DeviceType.PDF) {
            // this.pgs.selectPrinter(null, DeviceType.PDF).subscribe()
        }

        console.log('device', device)
        if (device === DeviceType.USB) {
            this.pgs.selectPrinter(DeviceType.USB)
            this.printUsbService
                .reconectar()
                .pipe(
                    filter(device => device !== null),
                    switchMap(() => {
                        // this.printerInfo = device
                        return this.printUsbService.connect()
                    })
                )
                .subscribe()
        }
        if (device === DeviceType.BLUETOOTH) {
            this.pgs.selectPrinter(DeviceType.BLUETOOTH)
            this.printBluetoothService
                .reconectar()
                .pipe(
                    filter(device => device !== null),
                    switchMap(() => {
                        // this.printerInfo = device
                        return this.printBluetoothService.connect()
                    })
                )

                .subscribe(() => {
                    console.log('conectado')
                })
        }

        if (device === DeviceType.PDF) {
            this.pgs.selectPrinter(DeviceType.PDF)
            this.pgs.reconectar().subscribe()
        }
    }
}
