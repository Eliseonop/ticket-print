/// <reference types="web-bluetooth" />

import { Component, OnInit } from '@angular/core'
import { Observable, map } from 'rxjs'

@Component({
    selector: 'app-print-bluetooth',
    templateUrl: './print-bluetooth.component.html',
    styleUrls: ['./print-bluetooth.component.scss']
})
export class PrintBluetoothComponent implements OnInit {
    private readonly PRINT_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb'
    device?: BluetoothDevice

    docs: any
    constructor () {}

    ngOnInit (): void {
        console.log(this.isSupported)
    }

    public get isSupported (): boolean {
        this.docs = !!navigator.bluetooth + ''
        return !!navigator.bluetooth
    }

    onConnectBluetooth () {
        this.requestBluetooth().subscribe(
            (device: BluetoothDevice) => {
                // Maneja el dispositivo Bluetooth conectado aquí
                console.log('Dispositivo conectado:', device)
            },
            error => {
                // Maneja los errores aquí
                console.error(
                    'Error al conectar al dispositivo Bluetooth:',
                    error
                )
            }
        )
    }

    public requestBluetooth (): Observable<BluetoothDevice> {
        return new Observable(observer => {
            navigator.bluetooth
                .requestDevice({
                    acceptAllDevices: true,
                    filters: [{ services: [0x1800, 0x1801] }]
                    // optionalServices: ['battery_service']
                })
                .then((result: BluetoothDevice) => {
                    this.device = result
                    return observer.next(result)
                })
                .catch(error => {
                    return observer.error(error)
                })
        })
    }
}
