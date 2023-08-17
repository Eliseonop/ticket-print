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
import { DateTime } from 'luxon'
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
    viewLogo = false
    // {
    //     language: 'esc-pos',
    //     imageMode: 'raster'
    // }
    modal = null

    configuracion = {
        nombreEmpresa: true,
        ruc: true,
        direccion: true
    }
    empresa = {
        nombre: 'Tcontur'
    }
    ruc = {
        nombre: '12345678901'
    }
    direccion = {
        nombre: 'Av. Los Alamos 123'
    }

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
        this.deviceService.selectedDevice.subscribe(device => {
            this.device = device
        })

        this.ticketService
            .getTicketData()
            .subscribe((data: ReciboDetalleModel) => {
                this.recibo = data
            })

        this.img.src = `${window.location.origin}/assets/images/tcontur.jpg`
    }

    requestDevice () {
        this.deviceService.requestDevice()
    }

    print () {
        if (this.device) {
            console.log('dispositivo conectado', this.device)
            // Realizar la impresión
            this.getTicketToUnicode(this.recibo)
        } else {
            this.deviceService.requestDevice() // Solicitar dispositivo si no está conectado
        }
    }

    async generateCodeHeader (
        data: ReciboDetalleModel
    ): Promise<ThermalPrinterEncoder> {
        const headerInfo = {}
        const tableDatos = [['FECHA', this.transformDate(data?.hora)]]
        const tableFondos = []

        // instance of coder
        const codeHeader = new ThermalPrinterEncoder()
            .setPinterType(58)
            .align('center')
        if (this.configuracion.nombreEmpresa) {
            headerInfo['nombreEmpresa'] = this.empresa.nombre
        }
        if (this.configuracion.ruc) {
            headerInfo['ruc'] = this.ruc.nombre
        }

        if (this.configuracion.direccion) {
            headerInfo['direccion'] = this.direccion.nombre
        }

        if (this.esContable(data)) {
            // console.log('img', img)
            this.viewLogo = true
            if (data.documento.sunat.codigo === 1) {
                tableDatos.push(['RUC', data.cliente.ruc + ''])
            } else {
                tableDatos.push(['DNI', , data.cliente.dni])
            }
            tableDatos.push(['RAZON', data.cliente.nombre])
            if (data.cliente.tipo === 'U') {
                tableDatos.push(['PADRON', data.cliente.referencia])
            }
            if (data.cliente.direccion) {
                tableDatos.push(['DIRECCION', data.cliente.direccion])
            }
            if (data.observacion) {
                tableDatos.push(['OBSERVACION', data.observacion])
            }

            if (headerInfo['nombreEmpresa']) {
                codeHeader.line(headerInfo['nombreEmpresa'])
            }

            if (headerInfo['ruc']) {
                codeHeader.line('RUC: ' + headerInfo['ruc'])
            }

            if (headerInfo['direccion']) {
                codeHeader.line(headerInfo['direccion'])
            }
            if (this.viewLogo) {
                codeHeader
                    .image(this.img, 560, 184, 'atkinson', 255)
                    .emptyLine(2)
            }
        } else {
            tableDatos.push(['DNI', data.cliente.dni])
            tableDatos.push(['NOMBRE', data.cliente.nombre])
            if (data.conductor) {
                tableDatos.push(['CONDUCTOR', data.conductor.codigo])
            }
        }

        codeHeader
            .bold(true)
            .line(data.documento.nombre)
            .line(data.serie + '- "' + data.numero)
            .bold(false)

            .emptyLine(1)
            .align('left')
            .table(
                [
                    {
                        width: 11,
                        align: 'left',
                        bold: true
                    },
                    {
                        align: 'left'
                    }
                ],
                [...tableDatos]
            )
            .printLineFull('-')

        return codeHeader
    }

    async generateCodeBody (
        data: ReciboDetalleModel
    ): Promise<ThermalPrinterEncoder> {
        const codeBodyGenerate = new ThermalPrinterEncoder()
        const deudas = []
        const items = data.items.map((item: ItemModel) => {
            console.log(item)
            console.log(item?.stringRecibo)
            console.log(item?.cantidad)

            return [item?.stringRecibo, item.cantidad + '', item.precio + '']
        })

        codeBodyGenerate
            .bold(true)
            .table(
                [
                    { width: 28, align: 'left' },
                    { width: 10, align: 'right' },
                    { width: 10, align: 'right' }
                ],
                [['DESCRIPCION', 'CANT', 'IMPORTE']]
            )
            .bold(false)
            .table(
                [
                    { width: 28, align: 'left' },
                    { width: 10, align: 'right' },
                    { width: 10, align: 'right' }
                ],
                [...items]
            )
            .emptyLine(1)
        if (this.esContable(data)) {
            codeBodyGenerate.table(
                [
                    { width: 36, marginRight: 2, align: 'right' },
                    { width: 10, align: 'right' }
                ],
                [
                    ['GRAV.', this.toCurrency(data?.base, data.moneda)],
                    ['IVA', this.toCurrency(data?.igv, data.moneda)]
                ]
            )
        }
        codeBodyGenerate.table(
            [
                { width: 36, marginRight: 2, align: 'right' },
                { width: 10, align: 'right' }
            ],
            [['TOTAL', this.toCurrency(data?.total, data.moneda)]]
        )

        if (!this.esContable(data)) {
            if (data.deudas.length > 0) {
                console.log('data.deudas', data.deudas)
                codeBodyGenerate
                    .printLineFull('-')
                    // .line('DEUDAS')
                    .table(
                        [
                            { width: 24, align: 'left' },
                            { width: 12, align: 'right' },
                            { width: 12, align: 'right' }
                        ],
                        [
                            ['DEUDA', 'INICIAL', 'SALDO'],
                            ...data.deudas.map(deuda => {
                                console.log('deuda', deuda)
                                return [
                                    deuda.nombre + this.shortDia(deuda.dia),
                                    this.toCurrency(deuda.inicial, data.moneda),
                                    this.toCurrency(deuda.saldo, data.moneda)
                                ]
                            })
                        ]
                    )
            }
            if (data.fondos.length > 0) {
                codeBodyGenerate
                    .printLineFull('-')
                    // .line('FONDOS')
                    .table(
                        [
                            { width: 28, align: 'left' },
                            { width: 20, align: 'right' }
                        ],
                        [
                            ['FONDO', 'TOTAL'],
                            ...data.fondos.map(fondo => {
                                return [
                                    fondo.nombre,
                                    this.toCurrency(fondo.total, data.moneda)
                                ]
                            })
                        ]
                    )
            }
            if (true) {
                codeBodyGenerate
                    .printLineFull('-')
                    // .line('SALDO')
                    .table(
                        [
                            { width: 28, align: 'left' },
                            { width: 20, align: 'right' }
                        ],
                        [
                            [
                                'EN EFECTIVO',
                                (data.total - data.saldo).toFixed(2)
                            ],
                            ['AL CREDITO', data.saldo.toFixed(2) + '']
                        ]
                    )
                    .emptyLine(7)

                    // poner una liena para su firma centrado y la fecha y abajo firma y dni
                    .align('center')
                    .line('______________________________')
                    .line('FIRMA Y DNI')
            }
        }

        return codeBodyGenerate
    }

    async generateCodeFooter (
        data: ReciboDetalleModel
    ): Promise<ThermalPrinterEncoder> {
        const codeFooterGenerate = new ThermalPrinterEncoder()

        const qrInformation = {
            ruc: data.cliente.codigo,
            tipo: data.documento.nombre,
            serie: data.serie,
            numero: data.numero,
            total: data.total,
            igv: data.igv
        }

        codeFooterGenerate
            .emptyLine(2)

            .align('center')
            .line('Representacion impresa de la factura electronica')
            .line('Para consultar el documento visite')
            .line('https://www.tcontur.com')
            .qrcode(JSON.stringify(qrInformation), 1, 4, 'm')

            // .qrcode('https://nielsleenheer.com' + data.numero)
            .cut()

        return codeFooterGenerate
    }

    async getTicketToUnicode (data: ReciboDetalleModel) {
        // info for tables or code

        // instance of coder
        if (this.img.complete) {
            const codeHeader = await this.generateCodeHeader(data)
            const codeBody = await this.generateCodeBody(data)
            const codeFooter = await this.generateCodeFooter(data)

            const header: Uint8Array = new Uint8Array(codeHeader.encode())
            const body: Uint8Array = new Uint8Array(codeBody.encode())
            const footer: Uint8Array = new Uint8Array(codeFooter.encode())

            // header.set(codeHeader.encode())
            // body.set(codeBody.encode())
            // footer.set(codeFooter.encode())

            console.log('header', header)
            console.log('body', body)
            console.log('footer', footer)

            // console.log('codeHeader', codeHeader.encode())
            // console.log('codeBody', codeBody.encode())
            // console.log('codeFooter', codeFooter.encode())

            const combinedCode = new Uint8Array(
                header.byteLength + body.byteLength + footer.byteLength
            )
            combinedCode.set(header)
            combinedCode.set(body, header.byteLength)
            combinedCode.set(footer, header.byteLength + body.byteLength)

            console.log('combinedCode', combinedCode)
            await this.sendDataToDevice(combinedCode)
        }
    }

    async sendDataToDevice (data: Uint8Array): Promise<void> {
        // await this.initializeDevice() // Asegúrate de que el dispositivo esté listo

        console.log('data', data)
        await this.deviceService.write(data)
    }
    transformDate (date: Date): string {
        // 2023-07-27T10:25:20.958149-05:00"
        if (!date) return ''
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
    private esContable (data: ReciboDetalleModel) {
        return (
            data.documento?.sunat?.codigo === 1 ||
            data.documento?.sunat?.codigo === 3 ||
            data.documento?.sunat?.codigo === 7
        )
    }
    toCurrency (value, moneda: IMoneda = null): string {
        if (moneda) {
            return `${moneda.codigo}${value.toFixed(2)}`
        } else {
            return `${value.toFixed(2)}`
        }
    }
    shortDia (dia: string) {
        if (dia) {
            return DateTime.fromSQL(dia).toFormat(' yy-MM-dd')
        } else {
            return ''
        }
    }
}
