import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
// import ThermalPrinterEncoder from 'thermal-printer-encoder'
// import ThermalPrinterEncoder from 'esc-pos-encoder'
import { default as ThermalPrinterEncoder } from '@manhnd/esc-pos-encoder'
import { DeviceConnectService } from 'app/modules/print-html/devices-conect.service'
import { IMoneda } from 'app/modules/recibo/models/ticket.interface'
import {
    ItemModel,
    ReciboDetalleModel
} from 'app/modules/recibo/models/ticket.models'
import { TicketService } from 'app/modules/recibo/ticket.service'
import { BehaviorSubject, tap } from 'rxjs'
@Component({
    selector: 'app-print-html-list',
    templateUrl: './print-html-list.component.html',
    styleUrls: ['./print-html-list.component.scss']
})
export class PrintHtmlListComponent implements OnInit {
    @ViewChild('miElemento') miElemento: ElementRef
    decodedTicketContent: string = ''
    device: USBDevice
    isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    img = new Image()
    recibo: ReciboDetalleModel
    encoder = new ThermalPrinterEncoder()
    // {
    //     language: 'esc-pos',
    //     imageMode: 'raster'
    // }
    modal = null
    constructor (
        private ticketService: TicketService,
        private deviceService: DeviceConnectService,
        private _matDialog: MatDialog
    ) {
        // img.src = `${window.location.origin}/assets/images/nuphar.jpg`
        // img.src = `https://storage.googleapis.com/multiempresa-tcontur3/images/logos/lasflores.jpg`
        // console.log('img', this.img.complete)
    }

    preView () {}

    ngOnInit (): void {
        this.img.src = `${window.location.origin}/assets/images/tcontur.jpg`
        this.deviceService.selectedDevice.subscribe(device => {
            this.device = device
        })

        this.ticketService
            .getTicketData()
            .subscribe((data: ReciboDetalleModel) => {
                this.recibo = data
            })
    }

    requestDevice () {
        this.deviceService.requestDevice()
    }

    print () {
        if (this.device) {
            // Realizar la impresión
            this.getTicketToUnicode(this.recibo)
        } else {
            this.deviceService.requestDevice() // Solicitar dispositivo si no está conectado
        }
    }

    getTicketToUnicode (data: ReciboDetalleModel) {
        // const img = new Image()

        if (this.img.complete) {
            this.img.style.display = 'block'
            this.img.style.margin = '0 auto' // Esto centrará horizontalmente la imagen
            this.img.style.width = '100px'
            console.log(this.img.src)

            const codeHeader = this.encoder
                .setPinterType(58)
                .align('center')
                .image(this.img, 560, 184, 'atkinson', 255)
                .emptyLine(2)
                .bold(true)
                .line(data.documento.nombre)
                .line(data.serie + '- "' + data.numero)
                .bold(false)

                .emptyLine(1)
                .align('left')
                .table(
                    [
                        {
                            width: 10,
                            align: 'left'
                        },
                        {
                            align: 'left'
                        }
                    ],
                    [
                        ['FECHA', this.transformDate(data.hora)],
                        // ['HORA', data.hora],
                        ['RUC', data.cliente.codigo],
                        ['PADRON', data.cliente.padron],
                        ['DIRECCION', data.cliente.direccion]
                    ]
                )
                .printLineFull('-')
                .encode()
            const items = data.items.map((item: ItemModel) => {
                console.log(item)
                console.log(item?.stringRecibo)
                console.log(item?.cantidad)

                return [
                    item?.stringRecibo,
                    item.cantidad + '',
                    item.precio + ''
                ]
            })
            const codeBody = this.encoder
                .table(
                    [
                        { width: 28, align: 'left' },
                        { width: 10, align: 'right' },
                        { width: 10, align: 'right' }
                    ],
                    [['DESCRIPCION', 'CANT', 'IMPORTE'], ...items]
                )
                .emptyLine(1)

                .table(
                    [
                        { width: 36, marginRight: 2, align: 'right' },
                        { width: 10, align: 'right' }
                    ],
                    [
                        ['GRAV.', this.toCurrency(data?.base, data.moneda)],
                        ['IVA', this.toCurrency(data?.igv, data.moneda)],
                        ['TOTAL', this.toCurrency(data?.total, data.moneda)]
                    ]
                )
                .encode()

            const qrInformation = {
                ruc: data.cliente.codigo,
                tipo: data.documento.nombre,
                serie: data.serie,
                numero: data.numero,
                total: data.total,
                igv: data.igv
            }

            const codeFooter = this.encoder
                .emptyLine(2)

                .align('center')
                .line('Representacion impresa de la factura electronica')
                .line('Para consultar el documento visite')
                .line('https://www.tcontur.com')
                .qrcode(JSON.stringify(qrInformation), 1, 4, 'm')

                // .qrcode('https://nielsleenheer.com' + data.numero)
                .cut()
                .encode()

            const header: Uint8Array = new Uint8Array(codeHeader.length)
            const body: Uint8Array = new Uint8Array(codeBody.length)
            const footer: Uint8Array = new Uint8Array(codeFooter.length)

            header.set(codeHeader)
            body.set(codeBody)
            footer.set(codeFooter)

            const combinedCode = new Uint8Array(
                header.byteLength + body.byteLength + footer.byteLength
            )
            combinedCode.set(header)
            combinedCode.set(body, header.byteLength)
            combinedCode.set(footer, header.byteLength + body.byteLength)

            this.sendDataToDevice(combinedCode)
        }
    }

    async sendDataToDevice (data: Uint8Array): Promise<void> {
        // await this.initializeDevice() // Asegúrate de que el dispositivo esté listo
        await this.deviceService.write(data)
    }
    transformDate (date: Date): string {
        // 2023-07-27T10:25:20.958149-05:00"
        const fecha = new Date(date)
        //  esta fecha lucira asi 27/7/2023 con hora 10:25:20
        return `${fecha.getDate()}/${
            fecha.getMonth() + 1
        }/${fecha.getFullYear()}  ${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`
    }

    // async print () {
    //     console.log(this.img.complete, 'valro de la imagen completada')
    //     try {
    //         if (!this.device) {
    //             await this.requestDevice()
    //             if (this.recibo) {
    //                 this.getTicketToUnicode(this.recibo)
    //             }

    //             console.log('No selected device')
    //             return
    //         } else if (this.recibo) {
    //             this.getTicketToUnicode(this.recibo)
    //         }
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    // public async requestDevice (): Promise<void> {
    //     await this.deviceConnectService.requestDevice()
    //     await this.deviceConnectService.initializeDevice()
    // }

    toCurrency (value, moneda: IMoneda = null): string {
        if (moneda) {
            return `${moneda.codigo}${value.toFixed(2)}`
        } else {
            return `${value.toFixed(2)}`
        }
    }
}
