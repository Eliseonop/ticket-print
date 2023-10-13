import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { PrintAbstractService } from '../print-general/print-service-abstract'
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
export class PrintUsbService extends PrintAbstractService<USBDevice> {
    selectedDevice = new BehaviorSubject<USBDevice>(null)
    info = new BehaviorSubject<string>('')
    private endPoint: USBEndpoint = {
        direction: 'out',
        endpointNumber: 2,
        packetSize: 64,
        type: 'bulk'
    }
    isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    public get isSupported (): boolean {
        return !!navigator.usb
    }
    constructor () {
        super()
    }

    getInformation (): InfoDevice {
        return {
            productName: this.selectedDevice.value.productName,
            name: this.selectedDevice.value.productName,
            estado: this.isConnected.value,
            type: DeviceType.USB
        }
    }

    requestDevice (): Observable<USBDevice> {
        this.info.next('Buscando dispositivos USB...')
        return new Observable(observer => {
            navigator.usb
                .requestDevice({
                    filters: []
                })
                .then(device => {
                    this.info.next('Dispositivo seleccionado')
                    console.log('Dispositivo seleccionado:', device)
                    this.selectedDevice.next(device)
                    localStorage.setItem('device', DeviceType.USB)
                    return observer.next(this.selectedDevice.value)
                })
                .catch(error => {
                    this.info.next('Error al seleccionar el dispositivo USB')
                    console.error(
                        'Error al seleccionar el dispositivo USB:',
                        error
                    )
                    return observer.error(error)
                })
        })
    }

    reconnect (): Observable<USBDevice> {
        this.info.next('Buscando dispositivos USB...')
        return new Observable(observer => {
            navigator.usb.getDevices().then(async devices => {
                if (devices.length > 0) {
                    this.info.next('Dispositivo encontrado')
                    console.log('Dispositivo encontrado:', devices[0])
                    this.selectedDevice.next(devices[0])

                    return observer.next(this.selectedDevice.value)
                } else {
                    return observer.next(null)
                }
            })
        })
    }

    async connect () {
        this.info.next('Conectando con el dispositivo USB...')

        if (!this.selectedDevice) {
            console.log('Dispositivo no inicializado ')

            return
        }

        // ver por consola si el device esta disponible
        console.log(this.selectedDevice.value.isochronousTransferOut)
        const device = this.selectedDevice.value
        // console.log(device)
        try {
            this.info.next('Abriendo el dispositivo USB...')
            await device.open()
            await device.selectConfiguration(1)
            await device.claimInterface(
                device.configuration.interfaces[0].interfaceNumber
            )

            // console.log(device.configuration.interfaces[0].interfaceNumber)

            // console.log('device.configuration', device.configuration)
            const endPoints: USBEndpoint[] =
                device.configuration.interfaces[0].alternate.endpoints

            // console.log('endPoints', endPoints)
            this.endPoint = endPoints.find(
                (endPoint: any) => endPoint.direction === 'out'
            )

            this.info.next('Dispositivo conectado')

            this.isConnected.next(true)

            this.listenForUsbConnections()
        } catch (error) {
            this.info.next('Error al conectar con el dispositivo USB')

            console.log(error)
        }
    }

    private listenForUsbConnections (): void {
        if (navigator.usb) {
            navigator.usb.addEventListener('disconnect', () => {
                this.isConnected.next(false)
            })
            navigator.usb.addEventListener('connect', () => {
                this.isConnected.next(true)
            })
        } else {
            console.error(
                'La API navigator.usb no está disponible en este navegador.'
            )
        }
    }

    public async write (data: Uint8Array): Promise<void> {
        this.info.next('Imprimiendo...')

        if (!this.selectedDevice) {
            this.info.next('Dispositivo no inicializado ')

            console.log('Dispositivo no inicializado ')
            return
        }
        if (!this.endPoint) {
            this.info.next('Punto final no encontrado')

            console.log(' punto final no encontrado')
            return
        }

        try {
            this.info.next('Enviando datos al dispositivo USB...')

            await this.selectedDevice.value.transferOut(
                this.endPoint.endpointNumber,
                data
            )
        } catch (error) {
            this.info.next('Error al enviar datos al dispositivo USB')

            console.log('Error al imprimir en el dispositivo:', error)
        }
    }
}
