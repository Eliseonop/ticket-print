import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
// import ThermalPrinterEncoder from 'thermal-printer-encoder'
// import ThermalPrinterEncoder from 'esc-pos-encoder'
import EscPosEncoder from '@manhnd/esc-pos-encoder'
import { PrintUsbService } from 'app/modules/print-html/print-usb.service'
import { IMoneda } from 'app/modules/recibo/models/reciboDetalle.interface'
import {
    ItemModel,
    ReciboDetalleModel
} from 'app/modules/recibo/models/reciboDetalle.models'
import { ReciboDetalleService } from 'app/modules/recibo/reciboDetalle.service'
import { numeroALetras } from 'app/modules/utils/functions/numeroALetras'
import { DateTime } from 'luxon'
import { BehaviorSubject, filter, tap } from 'rxjs'
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
    // encoder = new ThermalPrinterEncoder()

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
    hora = DateTime.local()
    id = '123456789'
    caja = {
        usuario: {
            username: 'admin'
        }
    }
    anulado = false
    reimprimir = true
    user = {
        username: 'admin'
    }

    structureData = {
        header: {
            viewLogo: false,
            nombreEmpresa: null,
            ruc: null,
            direccion: null,
            documento: null,
            serie: null,
            numero: null,
            tableDatos: []
        },
        body: {
            items: [],
            grav: [],
            iva: [],
            total: [],
            fondos: [],
            deudas: [],
            saldo: []
        },
        footer: {
            totalLetras: null,
            pago: null,
            qr: null,
            footer: null,
            anulado: false,
            reimprimir: false,
            user: null,
            empresa: null,
            ahora: null
        }
    }
    constructor (
        private ticketService: ReciboDetalleService,
        private printUsbService: PrintUsbService,
        private _matDialog: MatDialog
    ) {
        // img.src = `${window.location.origin}/assets/images/nuphar.jpg`
        // img.src = `https://storage.googleapis.com/multiempresa-tcontur3/images/logos/lasflores.jpg`
        // console.log('img', this.img.complete)
    }

    preView () {}

    ngOnInit (): void {
        // this.printUsbService.selectedDevice.subscribe(device => {
        //     this.device = device
        // })

        this.ticketService
            .getTicketData()
            .pipe(
                filter(data => !!data),
                tap((data: ReciboDetalleModel) => {
                    this.recibo = data
                    this.initSaveInformation(data)
                    console.log('data', this.structureData)
                })
            )
            .subscribe((data: ReciboDetalleModel) => {
                // this.recibo = data
            })

        this.img.src = `${window.location.origin}/assets/images/tcontur.jpg`
    }

    requestDevice () {
        this.printUsbService.requestDevice()
    }

    print () {
        if (this.device) {
            console.log('dispositivo conectado', this.device)
            // Realizar la impresión
            this.getTicketToUnicode(this.recibo)
        } else {
            this.printUsbService.requestDevice() // Solicitar dispositivo si no está conectado
        }
    }

    initSaveInformation (recibo: ReciboDetalleModel) {
        // HEADER INIT INFORMAITON
        this.structureData.header.tableDatos.push([
            'FECHA',
            this.transformDate(recibo?.hora)
        ])
        this.structureData.header.nombreEmpresa = this.empresa.nombre
        this.structureData.header.ruc = this.ruc.nombre
        this.structureData.header.direccion = this.direccion.nombre
        this.structureData.header.documento = recibo.documento?.nombre
        this.structureData.header.serie = recibo?.serie
        this.structureData.header.numero = recibo?.numero
        if (this.esContable(recibo)) {
            // es contable header
            this.structureData.header.viewLogo = true
            if (recibo.documento.sunat.codigo === 1) {
                this.structureData.header.tableDatos.push([
                    'RUC',
                    recibo.cliente.ruc + ''
                ])
            } else {
                this.structureData.header.tableDatos.push([
                    'DNI',
                    recibo.cliente.dni
                ])
            }
            this.structureData.header.tableDatos.push([
                'RAZON',
                recibo.cliente.nombre
            ])
            if (recibo.cliente.tipo === 'U') {
                this.structureData.header.tableDatos.push([
                    'PADRON',
                    recibo.cliente.referencia
                ])
            }
            if (recibo.cliente.direccion) {
                this.structureData.header.tableDatos.push([
                    'DIRECCION',
                    recibo.cliente.direccion
                ])
            }
            if (recibo.observacion) {
                this.structureData.header.tableDatos.push([
                    'OBSERVACION',
                    recibo.observacion
                ])
            }
            if (recibo.observacion) {
                this.structureData.header.tableDatos.push([
                    'OBSERVACION',
                    recibo.observacion
                ])
            }
            // es contable body

            this.structureData.body.grav = [
                'GRAV.',
                this.toCurrency(recibo?.base, recibo.moneda)
            ]

            this.structureData.body.iva = [
                'IVA',
                this.toCurrency(recibo?.igv, recibo.moneda)
            ]
            // es contable footer
            this.structureData.footer.totalLetras = `SON:  ${numeroALetras(
                recibo.total,
                recibo.monedaTextos
            )}`
            this.structureData.footer.pago = `Forma de pago: ${
                recibo.efectivo ? 'EFECTIVO' : 'CREDITO'
            }`
        } else {
            this.structureData.header.tableDatos.push([
                'DNI',
                recibo.cliente.dni
            ])
            this.structureData.header.tableDatos.push([
                'NOMBRE',
                recibo.cliente.nombre
            ])
            if (recibo.conductor) {
                this.structureData.header.tableDatos.push([
                    'CONDUCTOR',
                    recibo.conductor.codigo
                ])
            }
            // fondos
            if (recibo.fondos.length > 0) {
                this.structureData.body.fondos = [
                    ['FONDO', 'TOTAL'],
                    ...recibo.fondos.map(fondo => {
                        return [
                            fondo.nombre,
                            this.toCurrency(fondo.total, recibo.moneda)
                        ]
                    })
                ]
            }
            // deudas
            if (recibo.deudas.length > 0) {
                this.structureData.body.deudas = [
                    ['DEUDA', 'INICIAL', 'SALDO'],
                    ...recibo.deudas.map(deuda => {
                        return [
                            deuda.nombre + this.shortDia(deuda.dia),
                            this.toCurrency(deuda.inicial, recibo.moneda),
                            this.toCurrency(deuda.saldo, recibo.moneda)
                        ]
                    })
                ]
            }
            // saldo
            if (recibo.saldo) {
                this.structureData.body.saldo = [
                    ['EN EFECTIVO', (recibo.total - recibo.saldo).toFixed(2)],
                    ['AL CREDITO', recibo.saldo.toFixed(2) + '']
                ]
            }
        }
        // BODY INIT INFORMATION
        this.structureData.body.items = recibo.items.map((item: ItemModel) => {
            return [
                item?.stringRecibo,
                this.toCurrency(item?.precio, recibo.moneda)
            ]
        })
        this.structureData.body.total = [
            'TOTAL',
            this.toCurrency(recibo?.total, recibo.moneda)
        ]

        // FOOTER INIT INFORMATION
        const qrInformation = {
            ruc: recibo.cliente.codigo,
            tipo: recibo.documento.nombre,
            serie: recibo.serie,
            numero: recibo.numero,
            total: recibo.total,
            igv: recibo.igv
        }
        this.structureData.footer.qr = JSON.stringify(qrInformation)

        this.structureData.footer.footer = `H.PROC: ${this.hora.toFormat(
            'yyyy-MM-dd HH:mm:ss'
        )} ID: ${this.id} ${this.caja.usuario.username.toUpperCase()}`
        this.structureData.footer.anulado = this.anulado
        this.structureData.footer.reimprimir = this.reimprimir
        this.structureData.footer.user = this.user.username.toUpperCase()
        this.structureData.footer.empresa = 'Sistema de Gestion TCONTUR'
        this.structureData.footer.ahora = DateTime.now().toFormat(
            'yyyy-MM-dd HH:mm:ss'
        )
    }

    async generateCodeHeader (data: ReciboDetalleModel): Promise<EscPosEncoder> {
        const codeHeader = new EscPosEncoder().setPinterType(58).align('center')
        if (this.structureData.header.nombreEmpresa) {
            codeHeader.line(this.structureData.header.nombreEmpresa)
        }
        if (this.structureData.header.ruc) {
            codeHeader.line('RUC: ' + this.structureData.header.ruc)
        }

        if (this.configuracion.direccion) {
            codeHeader.line(this.structureData.header.direccion)
        }

        if (this.structureData.header.viewLogo) {
            codeHeader.image(this.img, 560, 184, 'atkinson', 255).emptyLine(2)
        }

        console.log('data.documento.nombre', data.documento?.nombre)
        console.log('data.serie', data?.serie)
        console.log('data.numero', data?.numero)
        codeHeader
            .bold(true)
            .line(this.structureData.header?.documento)
            .line(
                this.structureData.header.serie +
                    '-' +
                    this.structureData.header.numero
            )
            .bold(false)

            .emptyLine(1)
            .align('left')
            .table(
                [
                    {
                        width: 11,
                        align: 'left'
                    },
                    {
                        align: 'left'
                    }
                ],
                [...this.structureData.header.tableDatos]
            )
            .printLineFull('-')

        return codeHeader
    }

    async generateCodeBody (data: ReciboDetalleModel): Promise<EscPosEncoder> {
        const codeBodyGenerate = new EscPosEncoder()

        codeBodyGenerate
            .bold(true)
            .table(
                [
                    { width: 38, align: 'left' },
                    { width: 10, align: 'right' }
                ],
                [['DESCRIPCION', 'IMPORTE']]
            )
            .bold(false)
            .table(
                [
                    { width: 38, align: 'left' },
                    // { width: 10, align: 'right' },
                    { width: 10, align: 'right' }
                ],
                [...this.structureData.body.items]
            )
            .emptyLine(1)
        if (
            this.structureData.body.grav.length > 0 &&
            this.structureData.body.iva.length > 0
        ) {
            codeBodyGenerate.table(
                [
                    { width: 36, marginRight: 2, align: 'right' },
                    { width: 10, align: 'right' }
                ],
                [this.structureData.body.grav, this.structureData.body.iva]
            )
        }
        codeBodyGenerate.table(
            [
                { width: 36, marginRight: 2, align: 'right' },
                { width: 10, align: 'right' }
            ],
            [this.structureData.body.total]
        )

        if (this.structureData.body.fondos.length > 0) {
            codeBodyGenerate
                .printLineFull('-')
                // .line('FONDOS')
                .table(
                    [
                        { width: 28, align: 'left' },
                        { width: 20, align: 'right' }
                    ],
                    [...this.structureData.body.fondos]
                )
        }
        if (this.structureData.body.deudas.length > 0) {
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
                    [...this.structureData.body.deudas]
                )
        }

        if (this.structureData.body.saldo.length > 0) {
            codeBodyGenerate
                .printLineFull('-')
                // .line('SALDO')
                .table(
                    [
                        { width: 28, align: 'left' },
                        { width: 20, align: 'right' }
                    ],
                    [...this.structureData.body.saldo]
                )
                .emptyLine(4)

                // poner una liena para su firma centrado y la fecha y abajo firma y dni
                .align('center')
                .line('______________________________')
                .line('FIRMA Y DNI')
        }

        return codeBodyGenerate
    }

    async generateCodeFooter (data: ReciboDetalleModel): Promise<EscPosEncoder> {
        const codeFooterGenerate = new EscPosEncoder()
        codeFooterGenerate.align('left')

        if (this.structureData.footer.totalLetras) {
            codeFooterGenerate.line(this.structureData.footer.totalLetras)
        }
        if (this.structureData.footer.pago) {
            codeFooterGenerate.line(this.structureData.footer.pago)
        }

        codeFooterGenerate.align('center')

        if (this.ruc) {
            codeFooterGenerate.qrcode(this.structureData.footer.qr, 1, 4, 'm')
        }

        codeFooterGenerate.emptyLine(1).line(this.structureData.footer.footer)
        if (this.anulado) {
            codeFooterGenerate
                .emptyLine(1)
                .line('****** ANULADO ******')
                .line(`H.IMP: ${this.structureData.footer?.ahora}`)
        }
        if (this.reimprimir) {
            codeFooterGenerate

                // para imprimir tildes
                .codepage('cp437')

                .emptyLine(1)
                .line('****** REIMPRESIÓN ******')
                .line(
                    `H.IMP: ${this.structureData.footer?.ahora} ${this.structureData.footer?.user}`
                )
        }
        codeFooterGenerate.line(`Sistema de Gestion TCONTUR`)

        // .line('Representacion impresa de la factura electronica')
        // .line('Para consultar el documento visite')
        // .line('https://www.tcontur.com')

        // .qrcode('https://nielsleenheer.com' + data.numero)
        codeFooterGenerate.cut()

        return codeFooterGenerate
    }

    async getTicketToUnicode (data: ReciboDetalleModel) {
        if (this.img.complete) {
            const codeHeader = await this.generateCodeHeader(data)
            const codeBody = await this.generateCodeBody(data)
            const codeFooter = await this.generateCodeFooter(data)

            const header: Uint8Array = new Uint8Array(codeHeader.encode())
            const body: Uint8Array = new Uint8Array(codeBody.encode())
            const footer: Uint8Array = new Uint8Array(codeFooter.encode())
            console.log('header', header)
            console.log('body', body)
            console.log('footer', footer)

            const combinedCode = new Uint8Array(
                header.byteLength + body.byteLength + footer.byteLength
            )
            combinedCode.set(header)
            combinedCode.set(body, header.byteLength)
            combinedCode.set(footer, header.byteLength + body.byteLength)

            await this.sendDataToDevice(combinedCode)
        }
    }

    async sendDataToDevice (data: Uint8Array): Promise<void> {
        await this.printUsbService.write(data)
    }
    transformDate (date: DateTime): string {
        // 2023-07-27T10:25:20.958149-05:00"
        if (!date) return ''
        // const fecha = new Date(date.toISO())
        //  esta fecha lucira asi: 27/7/2023 10:25:20
        console.log('date', date)
        console.log('date.toFormat', date.toFormat('yyyy-MM-dd HH:mm:ss'))
        return date.toFormat('yyyy-MM-dd HH:mm:ss')
    }

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
