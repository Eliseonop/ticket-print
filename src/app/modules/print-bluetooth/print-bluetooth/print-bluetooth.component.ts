/// <reference types="web-bluetooth" />

import { AfterViewInit, Component, OnInit } from '@angular/core'
import EscPosEncoder from '@manhnd/esc-pos-encoder'
import { PrintGeneralService } from 'app/modules/print-general/print-general.service'
import { BehaviorSubject, Observable, interval, map } from 'rxjs'

@Component({
    selector: 'app-print-bluetooth',
    templateUrl: './print-bluetooth.component.html',
    styleUrls: ['./print-bluetooth.component.scss']
})
export class PrintBluetoothComponent implements OnInit, AfterViewInit {
    device: BluetoothDevice
    docs: any
    error: any
    private readonly PRINT_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb'
    private readonly PRINT_CHARACTERISTIC_UUID =
        '00002af1-0000-1000-8000-00805f9b34fb'
    private printCharacteristic?: BluetoothRemoteGATTCharacteristic
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    )
    devicesVinculados = new BehaviorSubject<BluetoothDevice[]>([])
    constructor (private pgs: PrintGeneralService) {}
    async generateCode () {
        const codeHeader = new EscPosEncoder().setPinterType(36)

        codeHeader
            .text('12345678901234567890123456789012345678901234567890')
            .emptyLine()
            .emptyLine()
            .cut()

        const codigo = new Uint8Array(codeHeader.encode())
        await this.pgs.print(codigo)
    }

    ngOnInit (): void {
        try {
            console.log(navigator.bluetooth)
        } catch (error) {
            console.log(error)
        }

        // setTimeout(() => {
        //     this.onConnectBluetooth()
        // }, 1000)
    }

    ngAfterViewInit (): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
    }

    public get isSupported (): boolean {
        return !!navigator.bluetooth
    }

    onConnectBluetooth () {
        this.requestBluetooth().subscribe(
            (device: BluetoothDevice) => {
                // Maneja el dispositivo Bluetooth conectado aquí
                console.log('Dispositivo conectado:', device)
                if (device) {
                    this.device = device
                }
                if (this.device) {
                    this.connect()
                }
            },
            error => {
                // Maneja los errores aquí
                this.error = error
                console.error(
                    'Error al conectar al dispositivo Bluetooth:',
                    error
                )
            }
        )
    }
    public connect () {
        this.device?.gatt
            ?.connect()
            .then(server => server.getPrimaryService(this.PRINT_SERVICE_UUID))
            .then(service =>
                service.getCharacteristic(this.PRINT_CHARACTERISTIC_UUID)
            )
            .then(characteristic => {
                // Cache the characteristic
                console.log('characteristic', characteristic)
                this.printCharacteristic = characteristic
                console.log('Conectado al dispositivo Bluetooth', this.device)
                this.isConnected.next(true)
            })
            .catch(result => {
                console.log('Error al conectar con el dispositivo:', result)
                this.isConnected.next(false)
            })
    }

    getDevicesVinculados () {
        navigator.bluetooth.getDevices().then(async devices => {
            this.devicesVinculados.next(devices)

            if (devices.length > 0) {
                this.device = devices[0]
                // this.device.gatt.connect()
                console.log('Dispositivo Bluetooth encontrado', this.device)
            }
            this.connect()

            console.log('Dispositivos vinculados:', devices)
        })
    }

    public requestBluetooth (): Observable<BluetoothDevice> {
        return new Observable(observer => {
            navigator.bluetooth
                .requestDevice({
                    filters: [
                        {
                            services: [this.PRINT_SERVICE_UUID]
                        }
                    ]
                    // acceptAllDevices: true

                    // optionalServices
                    // filters: []
                    // filters: [{ services: [this.PRINT_SERVICE_UUID] }]
                })
                .then((result: BluetoothDevice) => {
                    console.log('result', result)
                    this.device = result
                    return observer.next(result)
                })
                .catch(error => {
                    return observer.error(error)
                })
        })
    }
    async printData (data: Uint8Array) {
        try {
            if (this.printCharacteristic) {
                // writeValueWithResponse allows max 512 for operation, so we have to split the data
                const chunks = this.sliceIntoChunks(data, 512)
                for (const chunk of chunks) {
                    await this.printCharacteristic.writeValueWithResponse(chunk)
                }
            }
        } catch (error) {
            console.error('Error al enviar datos de impresión:', error)
        }
    }
    private sliceIntoChunks (arr: Uint8Array, chunkSize: number): Uint8Array[] {
        const res = []
        for (let i = 0; i < arr.length; i += chunkSize) {
            const chunk = arr.slice(i, i + chunkSize)
            res.push(chunk)
        }
        return res
    }
}
