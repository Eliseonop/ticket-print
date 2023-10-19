//
import { Injectable } from '@angular/core'
import {
    BehaviorSubject,
    Observable,
    switchMap,
    tap,
    filter,
    Observer
} from 'rxjs'
import { DeviceType } from '../print-general/print-general.service'

export interface InfoDevice {
    productName: string
    name: string
    estado: boolean
    type: DeviceType
}

@Injectable({
    providedIn: 'root'
})
export class PrintUsbService {
    selectedDevice = new BehaviorSubject<USBDevice>(null)
    process = new BehaviorSubject<string>('')
    infoDevice = new BehaviorSubject<InfoDevice>(null)
    private endPoint: USBEndpoint = {
        direction: 'out',
        endpointNumber: 2,
        packetSize: 64,
        type: 'bulk'
    }

    public get isSupported (): boolean {
        return !!navigator.usb
    }
    constructor () {}

    public reconectar (): Observable<boolean> {
        return new Observable(observer => {
            navigator.usb.getDevices().then(async devices => {
                if (devices.length > 0) {
                    this.process.next('Dispositivo encontrado')
                    console.log('Dispositivo encontrado:', devices[0])
                    this.selectedDevice.next(devices[0])
                    this.infoDevice.next(this.getInformation())
                    // return observer.next(this.selectedDevice.value)
                    return observer.next(true)
                } else {
                    return observer.next(null)
                }
            })
        })
    }

    getInformation (): InfoDevice {
        return {
            productName: this.selectedDevice.value.productName,
            name: this.selectedDevice.value.productName,
            estado: this.selectedDevice.value.opened,
            type: DeviceType.USB
        }
    }

    resetService (): void {
        this.selectedDevice.next(null)
        this.infoDevice.next(null)
        this.process.next('')
        localStorage.removeItem('device')
    }

    disconnect (): void {
        if (!this.selectedDevice) {
            console.log('Dispositivo no inicializado ')
            return
        }
        if (this.selectedDevice.value?.opened) {
            this.selectedDevice.value?.close()
        }
        this.selectedDevice.next(null)
        this.infoDevice.next(null)
        this.process.next('')
        localStorage.setItem('device', DeviceType.PDF)
    }

    requestDevice (): Observable<USBDevice> {
        this.process.next('Buscando dispositivos...')
        return new Observable(observer => {
            navigator.usb
                .requestDevice({
                    filters: []
                })
                .then(device => {
                    this.process.next('Dispositivo seleccionado')
                    this.selectedDevice.next(device)
                    this.infoDevice.next(this.getInformation())
                    localStorage.setItem('device', DeviceType.USB)
                    return observer.next(this.selectedDevice.value)
                })
                .catch(error => {
                    this.process.next('Error al seleccionar')

                    console.error('Ningún dispositivo seleccionado.', error)
                    return observer.error(error)
                })
        })
    }

    connect (): Observable<boolean> {
        this.process.next('Conectando hardware USB...')
        if (!this.selectedDevice) {
            console.log('Dispositivo no inicializado ')

            return
        }

        console.log(this.selectedDevice.value.isochronousTransferOut)
        const device = this.selectedDevice.value

        return new Observable(observer => {
            this.selectedDevice.value
                .open()
                .then(() => this.selectedDevice.value.selectConfiguration(1))
                .then(() =>
                    this.selectedDevice.value.claimInterface(
                        this.selectedDevice.value.configuration.interfaces[0]
                            .interfaceNumber
                    )
                )
                .then(() => {
                    const endPoints: USBEndpoint[] =
                        device.configuration.interfaces[0].alternate.endpoints

                    // console.log('endPoints', endPoints)
                    this.endPoint = endPoints.find(
                        (endPoint: any) => endPoint.direction === 'out'
                    )

                    this.process.next('Dispositivo conectado')

                    this.infoDevice.next(this.getInformation())
                    this.listenForUsbConnections()
                    return observer.next(true)
                })
                .catch(error => {
                    this.process.next('Error de conexión USB')
                    console.log(error)
                    return observer.error(error)
                })
        })
    }

    private listenForUsbConnections (): void {
        if (navigator.usb) {
            navigator.usb.addEventListener('disconnect', () => {
                this.infoDevice.next(this.getInformation())
            })
            navigator.usb.addEventListener('connect', () => {
                this.infoDevice.next(this.getInformation())
            })
        } else {
            console.error(
                'La API navigator.usb no está disponible en este navegador.'
            )
        }
    }

    public async write (data: Uint8Array): Promise<void> {
        this.process.next('Imprimiendo...')

        if (!this.selectedDevice) {
            this.process.next('Dispositivo desconectado')

            console.log('Dispositivo no inicializado ')
            return
        }
        if (!this.endPoint) {
            this.process.next('Salida no encontrada')

            console.log(' punto final no encontrado')
            return
        }

        try {
            this.process.next('Imprimiendo...')

            await this.selectedDevice.value.transferOut(
                this.endPoint.endpointNumber,
                data
            )

            this.process.next('Impresión finalizada')
        } catch (error) {
            this.process.next('Error de impresión')

            // console.log('Error al imprimir en el dispositivo:', error)
        }
    }
}
