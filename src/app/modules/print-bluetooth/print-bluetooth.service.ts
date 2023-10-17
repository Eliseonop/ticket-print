import { Injectable } from '@angular/core'
import EscPosEncoder from '@manhnd/esc-pos-encoder'
import { BehaviorSubject, Observable } from 'rxjs'
import { PrintAbstractService } from '../print-general/print-service-abstract'
import { InfoDevice } from '../print-html/print-usb.service'
import { DeviceType } from '../print-general/print-general.service'

@Injectable({
    providedIn: 'root' // Puedes ajustar el alcance de tu servicio según tus necesidades
})
export class PrintBluetoothService extends PrintAbstractService<BluetoothDevice> {
    private readonly PRINT_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb'
    private readonly PRINT_CHARACTERISTIC_UUID =
        '00002af1-0000-1000-8000-00805f9b34fb'
    private printCharacteristic?: BluetoothRemoteGATTCharacteristic
    public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
        false
    )
    // devicesVinculados = new BehaviorSubject<BluetoothDevice[]>([])

    selectedDevice = new BehaviorSubject<BluetoothDevice>(null)
    info = new BehaviorSubject<string>('')
    public get isSupported (): boolean {
        return !!navigator.bluetooth
    }

    public disconnect (): void {
        if (!this.selectedDevice) {
            console.log('Dispositivo no inicializado ')
            return
        }
        this.selectedDevice.value.gatt.disconnect()
        this.isConnected.next(false)
        this.selectedDevice.next(null)
        localStorage.setItem('device', DeviceType.PDF)
    }

    getInformation (): InfoDevice {
        return {
            productName: this.selectedDevice.value.name,
            name: this.selectedDevice.value.name,
            estado: this.isConnected.value,
            type: DeviceType.BLUETOOTH
        }
    }

    public reconnect (): Observable<BluetoothDevice> {
        return new Observable(observer => {
            navigator?.bluetooth?.getDevices().then(devices => {
                console.log('devices', devices)
                if (devices.length > 0) {
                    this.info.next('Dispositivos encontrados')
                    this.selectedDevice.next(devices[0])

                    this.selectedDevice.value.watchAdvertisements().then(a => {
                        console.log('a', a)
                    })

                    this.selectedDevice.value.addEventListener(
                        'advertisementreceived',
                        event => {
                            this.info.next('Sincrionizando dispositivo...')
                            console.log('event', event)
                            // event.device.gatt.connect()
                            // this.selectedDevice.next(event.device)
                            this.connect()
                        }
                    )

                    return observer.next(this.selectedDevice.value)
                } else {
                    return observer.next(null)
                }
            })
        })
    }

    constructor () {
        super()
    }

    public connect (): void {
        this.info.next('Conectando Bluetooth...')

        this.selectedDevice.value?.gatt
            ?.connect()
            .then(server => server.getPrimaryService(this.PRINT_SERVICE_UUID))
            .then(service => {
                console.log('service', service)
                return service.getCharacteristic(this.PRINT_CHARACTERISTIC_UUID)
            })
            .then(characteristic => {
                this.printCharacteristic = characteristic
                this.info.next('Dispositivo Conectado')
                console.log(
                    'Conectado al dispositivo Bluetooth',
                    this.selectedDevice
                )
                this.isConnected.next(true)
            })
            .catch(result => {
                this.info.next('Error al conectar con el dispositivo')
                console.log('Error al conectar con el dispositivo:', result)
                this.isConnected.next(false)
            })
    }

    listenForDisconnect (): void {}

    public requestDevice (): Observable<BluetoothDevice> {
        this.info.next('Buscando dispositivos Bluetooth')
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
                    console.log('result', result)
                    this.info.next('Dispositivo seleccionado')
                    this.selectedDevice.next(result)
                    localStorage.setItem('device', DeviceType.BLUETOOTH)
                    return observer.next(result)
                })
                .catch(error => {
                    this.info.next('Error al seleccionar el dispositivo')
                    return observer.error(error)
                })
        })
    }

    async write (data: Uint8Array): Promise<void> {
        try {
            this.info.next('Enviando datos de impresión')
            if (this.printCharacteristic) {
                const chunks = this.sliceIntoChunks(data, 512)
                for (const chunk of chunks) {
                    await this.printCharacteristic.writeValueWithResponse(chunk)
                }
                this.info.next('Datos de impresión enviados')
            }
        } catch (error) {
            this.info.next('Error al enviar datos de impresión')
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
