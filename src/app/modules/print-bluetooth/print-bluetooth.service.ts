import { Injectable } from '@angular/core'
import EscPosEncoder from '@manhnd/esc-pos-encoder'
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs'
import { PrintAbstractService } from '../print-general/print-service-abstract'
import { InfoDevice } from '../print-html/print-usb.service'
import { DeviceType } from '../print-general/print-general.service'

@Injectable({
    providedIn: 'root' // Puedes ajustar el alcance de tu servicio según tus necesidades
})
export class PrintBluetoothService {
    private readonly PRINT_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb'
    private readonly PRINT_CHARACTERISTIC_UUID =
        '00002af1-0000-1000-8000-00805f9b34fb'
    private printCharacteristic?: BluetoothRemoteGATTCharacteristic
    // public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    //     false
    // )
    // devicesVinculados = new BehaviorSubject<BluetoothDevice[]>([])
    controller = new AbortController()
    public infoDevice = new BehaviorSubject<InfoDevice>(null)

    selectedDevice = new BehaviorSubject<BluetoothDevice>(null)
    process = new BehaviorSubject<string>('')
    public get isSupported (): boolean {
        return !!navigator.bluetooth
    }

    reconectar (): Observable<boolean> {
        return new Observable(observer => {
            navigator?.bluetooth?.getDevices().then(devices => {
                if (devices.length > 0) {
                    this.process.next('Dispositivos encontrados')
                    this.selectedDevice.next(devices[0])
                    this.infoDevice.next(this.getInformation())
                    this.process.next('Dispositivo encontrado')
                    this.selectedDevice.value.watchAdvertisements({
                        signal: this.controller.signal
                    })

                    this.selectedDevice.value.addEventListener(
                        'advertisementreceived',
                        event => {
                            this.process.next('Sincrionizando dispositivo...')
                            this.selectedDevice.next(event.device)
                            this.controller.abort()
                            return observer.next(true)
                        }
                    )

                    // observer.next(devices)
                } else {
                    observer.next(null)
                }
            })
        })
    }

    public disconnect (): void {
        if (!this.selectedDevice) {
            console.log('Dispositivo no inicializado ')
            return
        }
        if (!this.selectedDevice.value?.gatt.connected) {
            this.selectedDevice.value?.gatt.disconnect()
        }
        this.selectedDevice.next(null)
        this.infoDevice.next(null)
        // this.process.next('Dispositivo desconectado')
        localStorage.setItem('device', DeviceType.PDF)
    }

    getInformation (): InfoDevice {
        if (this.selectedDevice.value) {
            return {
                productName: this.selectedDevice.value.name,
                name: this.selectedDevice.value.name,
                estado: this.selectedDevice.value.gatt.connected,
                type: DeviceType.BLUETOOTH
            }
        } else {
            return null
        }
    }

    constructor () {}

    public connect (): Observable<boolean> {
        this.process.next('Conectando Bluetooth...')
        return new Observable(observer => {
            const gattServer = this.selectedDevice.value.gatt

            this.selectedDevice.value.addEventListener(
                'gattserverdisconnected',
                event => {
                    // Realizar las acciones necesarias para manejar la desconexión del dispositivo
                    console.log(
                        'El dispositivo Bluetooth se desconectó:',
                        event.target
                    )
                    this.process.next('El dispositivo Bluetooth se desconectó')
                    this.infoDevice.next(null)
                    return observer.error(false)
                }
            )
            gattServer
                .connect()
                .then(server =>
                    server.getPrimaryService(this.PRINT_SERVICE_UUID)
                )
                .then(service =>
                    service.getCharacteristic(this.PRINT_CHARACTERISTIC_UUID)
                )
                .then(characteristic => {
                    this.printCharacteristic = characteristic
                    this.process.next('Dispositivo Conectado')
                    console.log('Dispositivo Conectado', this.getInformation())
                    this.infoDevice.next(this.getInformation())
                    return observer.next(true)
                })
                .catch(error => {
                    this.process.next('Error al conectar con el dispositivo')
                    console.log('Error al conectar con el dispositivo:', error)
                    this.infoDevice.next(null)
                    return observer.error(false)
                })
        })
    }

    listenForDisconnect (): void {}

    public requestDevice (): Observable<BluetoothDevice> {
        this.process.next('Buscando dispositivos...')
        return new Observable(observer => {
            navigator.bluetooth
                .requestDevice({
                    filters: [
                        {
                            services: [this.PRINT_SERVICE_UUID]
                        }
                    ]
                })
                .then((result: BluetoothDevice) => {
                    this.process.next('Dispositivo seleccionado')
                    this.selectedDevice.next(result)
                    this.infoDevice.next(this.getInformation())
                    localStorage.setItem('device', DeviceType.BLUETOOTH)
                    return observer.next(result)
                })
                .catch(error => {
                    this.process.next('Dispocitivo no seleccionado')
                    return observer.error(error)
                })
        })
    }

    async write (data: Uint8Array): Promise<void> {
        try {
            this.process.next('Enviando datos de impresión')
            if (this.printCharacteristic) {
                const chunks = this.sliceIntoChunks(data, 512)
                for (const chunk of chunks) {
                    await this.printCharacteristic.writeValueWithResponse(chunk)
                }
                this.process.next('Datos de impresión enviados')
            }
        } catch (error) {
            this.process.next('Error al enviar datos de impresión')
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
