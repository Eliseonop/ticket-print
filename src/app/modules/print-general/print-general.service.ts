import { Injectable } from '@angular/core'
import { PrintBluetoothService } from '../print-bluetooth/print-bluetooth.service'
import { InfoDevice, PrintUsbService } from '../print-html/print-usb.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { PrintGeneralModalComponent } from './print-general-modal/print-general-modal.component'
import { BehaviorSubject, Observable, filter, switchMap, tap } from 'rxjs'
import { PrintAbstractService } from './print-service-abstract'
import { PdfService } from '../recibo/pdf.service'

export enum DeviceType {
    USB = 'usb',
    BLUETOOTH = 'bluetooth',
    PDF = 'pdf'
}

export enum WithPrint {
    MM80 = '80MM',
    MM58 = '58MM'
}

@Injectable({
    providedIn: 'root'
})
export class PrintGeneralService {
    deviceType = new BehaviorSubject<DeviceType>(null)
    infoDevice = new BehaviorSubject<InfoDevice>(null)
    process = new BehaviorSubject<string>('')
    withPrint = new BehaviorSubject<WithPrint>(WithPrint.MM80)
    constructor (
        public pdfService: PdfService,
        public usbService: PrintUsbService,
        public bluetoothService: PrintBluetoothService
    ) {}
    selectNoneAndDisconnect (): void {
        const currentDeviceType = this.deviceType.value

        // Desconectar el dispositivo actual si está conectado
        if (currentDeviceType === DeviceType.USB) {
            this.usbService.disconnect()
        } else if (currentDeviceType === DeviceType.BLUETOOTH) {
            this.bluetoothService.disconnect()
        } else if (currentDeviceType === DeviceType.PDF) {
            this.pdfService.disconnect()
        }
    }

    selectPrinter (deviceType: DeviceType): void {
        this.selectNoneAndDisconnect()
        this.deviceType.next(deviceType)
    }

    getInformation (): Observable<InfoDevice> {
        if (this.deviceType.value === DeviceType.USB) {
            return this.usbService.infoDevice
        } else if (this.deviceType.value === DeviceType.BLUETOOTH) {
            return this.bluetoothService.infoDevice
        } else if (this.deviceType.value === DeviceType.PDF) {
            return this.pdfService.infoDevice
        }
    }

    getProgress (): Observable<string> {
        if (this.deviceType.value === DeviceType.USB) {
            return this.usbService.process
        } else if (this.deviceType.value === DeviceType.BLUETOOTH) {
            return this.bluetoothService.process
        } else if (this.deviceType.value === DeviceType.PDF) {
            return this.pdfService.process
        }
    }

    requestDevice (): Observable<any> {
        if (this.deviceType.value === DeviceType.USB) {
            return this.usbService.requestDevice().pipe(
                filter((device: USBDevice) => !!device),
                switchMap(() => {
                    return this.usbService.connect()
                })
            )
        } else if (this.deviceType.value === DeviceType.BLUETOOTH) {
            return this.bluetoothService.requestDevice().pipe(
                filter((device: BluetoothDevice) => !!device),

                switchMap(() => {
                    return this.bluetoothService.connect()
                })
            )
        } else if (this.deviceType.value === DeviceType.PDF) {
            return this.pdfService.requestDevice()
        }
    }

    reconectar (): Observable<boolean> {
        if (this.deviceType.value === DeviceType.USB) {
            return this.usbService.reconectar()
        } else if (this.deviceType.value === DeviceType.BLUETOOTH) {
            return this.bluetoothService.reconectar()
        } else if (this.deviceType.value === DeviceType.PDF) {
            return this.pdfService.reconectar()
        }
    }

    print (data: any): void {
        if (this.deviceType.value === DeviceType.USB) {
            this.usbService.write(data)
        } else if (this.deviceType.value === DeviceType.BLUETOOTH) {
            this.bluetoothService.write(data)
        }
    }
}
