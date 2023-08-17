import { Injectable } from '@angular/core'
import { BehaviorSubject, tap } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class DeviceConnectService {
    selectedDevice: BehaviorSubject<USBDevice | null> =
        new BehaviorSubject<USBDevice | null>(null)
    private endPoint: USBEndpoint | undefined = {
        direction: 'out',
        endpointNumber: 2,
        packetSize: 64,
        type: 'bulk'
    }
    isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    constructor () {
        this.listenForUsbConnections()
        this.initializeDevice() // Llamar a la inicialización en el constructor
    }

    async requestDevice (): Promise<void> {
        try {
            const device = await navigator.usb.requestDevice({ filters: [] })
            if (device) {
                this.selectedDevice.next(device)
                await this.initializeDevice()
            }
        } catch (error) {
            console.log(error)
        }
    }

    async initializeDevice () {
        try {
            const devices = await navigator.usb.getDevices()
            if (devices.length > 0) {
                console.log('Dispositivo encontrado', devices)
                this.selectedDevice.next(devices[0])
                await this.configDevices() // Llamar a la configuración si hay dispositivo
            }
        } catch (error) {
            console.log(error)
        }
    }

    async configDevices () {
        if (!this.selectedDevice.value) {
            return
        }

        // ver por consola si el device esta disponible
        console.log(this.selectedDevice.value.isochronousTransferOut)
        const device = this.selectedDevice.value
        console.log(device)
        try {
            await device.open()
            await device.selectConfiguration(1)
            await device.claimInterface(
                device.configuration.interfaces[0].interfaceNumber
            )

            console.log(device.configuration.interfaces[0].interfaceNumber)

            console.log('device.configuration', device.configuration)
            const endPoints: USBEndpoint[] =
                device.configuration.interfaces[0].alternate.endpoints

            console.log('endPoints', endPoints)
            this.endPoint = endPoints.find(
                (endPoint: any) => endPoint.direction === 'out'
            )
            this.isConnected.next(true)
        } catch (error) {
            console.log(error)
        }
    }

    private listenForUsbConnections (): void {
        navigator.usb.addEventListener('disconnect', () => {
            this.isConnected.next(false)
        })
        navigator.usb.addEventListener('connect', () => {
            this.initializeDevice() // Actualizar dispositivos cuando se conecte
        })
    }

    public async write (data: Uint8Array): Promise<void> {
        if (!this.selectedDevice.value) {
            console.log('Dispositivo no inicializado ')
            return
        }
        if (!this.endPoint) {
            console.log(' punto final no encontrado')
            return
        }

        try {
            await this.selectedDevice.value.transferOut(
                this.endPoint.endpointNumber,
                data
            )
        } catch (error) {
            console.log('Error al escribir en el dispositivo:', error)
        }
    }
}
