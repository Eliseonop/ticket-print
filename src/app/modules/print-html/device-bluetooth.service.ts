/// <reference types="web-bluetooth" />

import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class DeviceBluetoothService {
    selectedDevice: BehaviorSubject<BluetoothDevice | null> =
        new BehaviorSubject<BluetoothDevice | null>(null)
    private gattServer: BluetoothRemoteGATTServer | null = null
    private isConnected: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false)

    private readonly PRINT_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb'
    private readonly PRINT_CHARACTERISTIC_UUID =
        '00002af1-0000-1000-8000-00805f9b34fb'

    constructor () {
        this.listenForBluetoothConnections()
        // this.initializeBluetooth() // Llamar a la inicialización en el constructor
    }

    public requestBluetooth (): Promise<BluetoothDevice> {
        return new Promise<BluetoothDevice>((resolve, reject) => {
            navigator.bluetooth
                .requestDevice({
                    filters: [{ services: [this.PRINT_SERVICE_UUID] }]
                })
                .then((device: BluetoothDevice) => {
                    resolve(device)
                })
                .catch((error: any) => {
                    console.error(
                        'Error al solicitar el dispositivo Bluetooth:',
                        error
                    )
                    reject(error)
                })
        })
    }

    // async initializeBluetooth () {
    //     try {
    //         const devices = await navigator.bluetooth.getDevices()
    //         if (devices.length > 0) {
    //             console.log('Dispositivo Bluetooth encontrado', devices)
    //             this.selectedDevice.next(devices[0])
    //             await this.connectDevice(devices[0])
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    async connectDevice (device: BluetoothDevice) {
        try {
            this.gattServer = await device.gatt.connect()
            this.isConnected.next(true)
            // Lógica adicional de configuración si es necesario
        } catch (error) {
            console.error(
                'Error al conectar con el dispositivo Bluetooth:',
                error
            )
        }
    }

    private listenForBluetoothConnections (): void {
        navigator.bluetooth.addEventListener('gattserverdisconnected', () => {
            this.isConnected.next(false)
        })
        // Puedes agregar más lógica aquí para manejar eventos de conexión, si es necesario
    }

    public async write (data: Uint8Array): Promise<void> {
        if (!this.gattServer) {
            console.log('Dispositivo no inicializado')
            return
        }

        try {
            const service = await this.gattServer.getPrimaryService(
                this.PRINT_SERVICE_UUID
            )
            const characteristic = await service.getCharacteristic(
                this.PRINT_CHARACTERISTIC_UUID
            )

            await characteristic.writeValue(data)
        } catch (error) {
            console.error(
                'Error al escribir en el dispositivo Bluetooth:',
                error
            )
        }
    }
}
