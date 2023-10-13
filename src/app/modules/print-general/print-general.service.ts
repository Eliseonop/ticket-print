import { Injectable } from '@angular/core'
import { PrintBluetoothService } from '../print-bluetooth/print-bluetooth.service'
import { InfoDevice, PrintUsbService } from '../print-html/print-usb.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { PrintGeneralModalComponent } from './print-general-modal/print-general-modal.component'
import { BehaviorSubject, Observable, filter, switchMap, tap } from 'rxjs'
import { PrintAbstractService } from './print-service-abstract'

export enum DeviceType {
    USB = 'usb',
    BLUETOOTH = 'bluetooth'
}

@Injectable({
    providedIn: 'root'
})
export class PrintGeneralService {
    deviceType = new BehaviorSubject<DeviceType>(null)
    servicePrinter:
        | PrintAbstractService<USBDevice>
        | PrintAbstractService<BluetoothDevice>
    infoDevice = new BehaviorSubject<InfoDevice>(null)
    info = new BehaviorSubject<string>('')
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    )
    constructor (public matDiaglog: MatDialog) {}

    isConnect (): Observable<boolean> {
        return this.servicePrinter?.isConnected
    }

    // getDeviceInformation (): {
    //     productName: string
    //     name: string
    // } {
    //     if (this.deviceType === DeviceType.USB) {
    //         // const service = this.servicePrinter as PrintUsbService
    //         const name = this.servicePrinter.selectedDevice.productName
    //         return {
    //             productName: name,
    //             name: name
    //         }
    //     } else if (this.deviceType === DeviceType.BLUETOOTH) {
    //         // const service = this.servicePrinter as PrintBluetoothService
    //         const name = this.servicePrinter.selectedDevice.name
    //         return {
    //             productName: name,
    //             name: name
    //         }
    //     }
    // }

    selectPrinter (
        servicePrinter:
            | PrintAbstractService<USBDevice>
            | PrintAbstractService<BluetoothDevice>,
        deviceType: DeviceType
    ): void {
        this.servicePrinter = servicePrinter
        this.deviceType.next(deviceType)
        this.servicePrinter.connect()

        this.servicePrinter.isConnected.subscribe(result => {
            console.log('isConnected', result)
            this.isConnected.next(result)
            this.infoDevice.next(this.servicePrinter.getInformation())
        })

        this.servicePrinter.info.subscribe((info: string) => {
            this.info.next(info)
        })
    }

    async print (data: Uint8Array) {
        if (this.servicePrinter) {
            await this.servicePrinter.write(data)
        }
    }
}
