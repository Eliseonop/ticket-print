import { Component, OnInit } from '@angular/core'
import { SalidaService } from '../salida.service'
import {
    ConfiguracionesModel,
    SalidaCompletaModel
} from '../models/salida.model'
import { GeocercaModel } from '../models/control.model'
import { DateTime } from 'luxon'
import { UserModel } from 'app/modules/recibo/models/reciboDetalle.models'
import EscPosEncoder from '@manhnd/esc-pos-encoder'
import { GeocercaService } from '../geocerca.service'
import { PrintUsbService } from 'app/modules/print-html/print-usb.service'
import { PrintGeneralService } from 'app/modules/print-general/print-general.service'
import { dataToTablePos } from 'app/modules/utils/functions/dataToTablePos'
import { map } from 'rxjs'

@Component({
    selector: 'app-salida-view',
    templateUrl: './salida-view.component.html',
    styleUrls: ['./salida-view.component.scss']
})
export class SalidaViewComponent implements OnInit {
    // printerType: PrinterType[] = [PrinterType['58mm'], PrinterType['80mm']]

    // selectedPrinterType = PrinterType['58mm']

    SelectPaperConfigStructure = {
        T4D1width: [{ w: 10 }, { w: 14 }, { w: 10 }, { w: 14 }],
        T2D2width: [{ w: 10 }, { w: 38 }],
        T4D3width: [{ w: 6 }, { w: 6 }, { w: 6 }, { w: 6, a: 'right' }],
        T5Cwidth: [
            { w: 4, a: 'left' },
            { w: 29, a: 'center' },
            { w: 5, a: 'center' },
            { w: 9, a: 'center' },
            { w: 1, a: 'right' }
        ],
        T4PHwidth: [
            { w: 12, a: 'left' },
            { w: 12, a: 'left' },
            { w: 12, a: 'right' },
            { w: 12, a: 'right' }
        ],
        T9SHwidth: [
            { w: 1 },
            { w: 22 },
            { w: 1 },
            { w: 7 },
            { w: 1 },
            { w: 7 },
            { w: 1 },
            { w: 7 },
            { w: 1 }
        ],
        T9SBwidth: [
            { w: 1 },
            { w: 7 },
            { w: 1 },
            { w: 14 },
            { w: 1 },
            { w: 7 },
            { w: 1 },
            { w: 7 },
            { w: 1 },
            { w: 7 },
            { w: 1 }
        ]
    }

    device: USBDevice
    private _geocercas: any[] = []
    get geocercas (): GeocercaModel[] {
        return this._geocercas
    }
    set geocercas (g) {
        this._geocercas = g
    }
    private _user: UserModel = {
        id: 123,
        cargo: 'Administrador',
        nombre: 'Administrador',
        username: 'Administrador'
    }
    get user (): UserModel {
        return this._user
    }
    set user (u: UserModel) {
        this._user = u
    }
    private company: ConfiguracionesModel = {
        id: 1,
        nombre: 'company',
        data: 'TCONTUR'
    }
    structureData = {
        header: {
            textCompany: null,
            table4Data1: null,
            table2Data2: null,
            table4Data3: null
        },
        body: {
            table5Controles: null,
            textLiqTitle: null,
            table4PadHora: null,
            table9SumHeader: null,
            table9Suministros: null
        },
        footer: {
            textHoraUser: null,
            textSalida: null,
            textData: null
        }
    }
    ruta = {
        codigo: '6354',
        nombre: 'RUTA'
    }
    constructor (
        private deviceService: PrintUsbService,
        private salidaService: SalidaService,
        private geocercaService: GeocercaService,
        private pgs: PrintGeneralService
    ) {}
    private imprimirNombre: ConfiguracionesModel
    private imprimirCodigo: ConfiguracionesModel

    salidaData: SalidaCompletaModel

    ngOnInit () {
        this.geocercaService.getGeocercaData().subscribe(data => {
            console.log('geocercas', data)
            this.geocercas = data
        })

        this.salidaService.getSalidaCompleta().subscribe(data => {
            console.log('data', data)
            if (data) {
                this.salidaData = data

                this.initSaveInformationLiquidacion(data, true)
            }
        })
    }
    getLadoString (lado: boolean | null): string {
        return lado === true ? 'B' : lado === false ? 'A' : 'A y B'
    }
    initSaveInformationLiquidacion (
        salida: SalidaCompletaModel,
        imprimirLiquidacion: boolean
    ) {
        salida.controles.forEach(c => c.setGeocerca(this.geocercas))
        const controles = salida.controles.filter(c => c.control)
        console.log(this.geocercas)
        console.log('controles', controles, salida.controles)
        let personal = []

        this.structureData.header.textCompany = this.company.data
        if (this.imprimirNombre && this.imprimirNombre.data === 'false') {
            if (this.imprimirCodigo && this.imprimirCodigo.data === 'false') {
                // this.structureData.header['title'] = ''
            } else {
                personal = [
                    [
                        'COND',
                        salida.getConductorName(this.imprimirNombre),

                        'COBR',
                        salida.getCobradorName(this.imprimirNombre)
                    ]
                ]
            }
        } else {
            personal = [
                ['COND', salida.getConductorName(this.imprimirNombre)],
                ['COBR', salida.getCobradorName(this.imprimirNombre)]
            ]
        }

        this.structureData.header.table4Data1 = [
            [
                'RUTA',
                this.ruta.codigo,
                'LADO',
                `${this.getLadoString(salida.lado)} ${salida.vuelta / 2}`
            ],
            ['DIA', salida.inicio.toFormat('yy-MM-dd'), 'PLACA', salida.placa]
        ]
        console.log('personal', [
            'PAD',
            salida.padron + '',
            `F${salida.frecuencia}`,
            salida.inicio.toFormat('HH:mm')
        ])
        this.structureData.header.table2Data2 = personal

        this.structureData.header.table4Data3 = [
            [
                'PAD',
                salida.padron + '',
                `F${salida.frecuencia}`,
                salida.inicio.toFormat('HH:mm')
            ]
        ]

        const crls = controles.map(d => [
            '|',
            d.geocercaName.slice(0, 20),
            '|',
            d.hora.toFormat('HH:mm'),
            '|'
        ])
        console.log('crls', crls)
        this.structureData.body.table5Controles = [
            ['', '', '', '', ''],

            ['|', 'CONTROL', '|', 'HORA', '|'],
            ...crls
        ]

        if (salida.unidad.suministros.length > 0 && imprimirLiquidacion) {
            this.structureData.body.textLiqTitle = 'LIQUIDACION DE BOLETOS'
            this.structureData.body.table4PadHora = [
                [
                    'PAD',
                    salida.padron + '',
                    'HORA',
                    salida.inicio.toFormat('HH:mm')
                ]
            ]
            this.structureData.body.table9SumHeader = [
                ['INSPECT'],
                ['LUGAR'],
                ['HORA']
            ]

            this.structureData.body.table9Suministros = [
                ...salida.unidad.suministros.map(s => {
                    const tacos = Math.floor((s.fin - s.actual) / 100)
                    let inicio =
                        s.actual.toString().padStart(6, '0') + `-${tacos}`
                    if (tacos === 0) {
                        inicio = s.actual.toString().padStart(6, '0')
                    }
                    return [s.boleto.tarifa.toFixed(1), inicio]
                })
            ]
        }

        this.structureData.footer.textHoraUser = `${DateTime.now().toFormat(
            'HH:mm:ss'
        )} ${this.user.username.toUpperCase()}`
        this.structureData.footer.textSalida = `SALIDA: ${salida.id}`
        this.structureData.footer.textData = `Sistema de Gestion TCONTUR`

        console.log('structureData', this.structureData)
        console.log(
            this.structureData.body.table9SumHeader
            // dataToTablePos(this.structureData.body.table9Suministros, 11)
        )
    }

    async generateCodeSalida (): Promise<EscPosEncoder> {
        const codeSalida = new EscPosEncoder()
            .align('center')
            .size(3)
            .underline(false)

        if (this.structureData.header.textCompany) {
            codeSalida.line(this.structureData.header.textCompany).emptyLine(1)
        }

        if (this.structureData.header.table4Data1) {
            codeSalida.align('left').table(
                this.SelectPaperConfigStructure.T4D1width.map(item => ({
                    width: item.w
                })),
                [...this.structureData.header.table4Data1]
            )
        }
        if (this.structureData.header.table2Data2) {
            codeSalida.align('left').table(
                this.SelectPaperConfigStructure.T2D2width.map(items => ({
                    width: items.w
                })),
                [...this.structureData.header.table2Data2]
            )
        }
        if (this.structureData.header.table4Data3) {
            codeSalida.size(2).table(
                this.SelectPaperConfigStructure.T4D3width.map(item => ({
                    width: item.w,
                    align: item.a ? item.a : 'center'
                })),
                [...this.structureData.header.table4Data3]
            )
        }
        if (this.structureData.body.table5Controles) {
            codeSalida
                .size(3)
                .underline(1)
                .bold(false)
                .underline(true)
                .underline(2)
                .table(
                    this.SelectPaperConfigStructure.T5Cwidth.map(item => ({
                        width: item.w,
                        align: item.a ? item.a : 'center'
                    })),
                    [...this.structureData.body.table5Controles]
                )
                .underline(false)
        }

        if (this.structureData.body.textLiqTitle) {
            codeSalida
                .emptyLine(1)
                .align('center')
                .bold(true)
                .size(3)
                .line(this.structureData.body.textLiqTitle)
        }

        if (this.structureData.body.table4PadHora) {
            codeSalida.size(3).table(
                [
                    {
                        width: 12,
                        align: 'left'
                    },
                    {
                        width: 12,
                        align: 'left'
                    },
                    {
                        width: 12,
                        align: 'right'
                    },
                    {
                        width: 12,
                        align: 'right'
                    }
                ],
                [...this.structureData.body.table4PadHora]
            )
        }

        if (this.structureData.body.table9Suministros) {
            const columsT9 = this.structureData.body.table9SumHeader.map(s =>
                dataToTablePos(s, 9)
            )

            const columnT11sum = this.structureData.body.table9Suministros.map(
                s => dataToTablePos(s, 11)
            )

            console.log(
                'columsT9',
                this.SelectPaperConfigStructure.T9SHwidth.map(item => ({
                    width: item.w
                }))
            )
            console.log('columsT9', [...columsT9])
            codeSalida
                .bold(false)
                .align('left')
                .size(3)
                .underline(true)
                .underline(2)
                .table(
                    this.SelectPaperConfigStructure.T9SHwidth.map(item => ({
                        width: item.w
                    })),

                    [['', '', '', '', '', '', '', '', ''], ...columsT9]
                )
                .table(
                    this.SelectPaperConfigStructure.T9SBwidth.map(item => ({
                        width: item.w
                    })),

                    [...columnT11sum]
                )
        }

        if (this.structureData.footer.textHoraUser) {
            codeSalida
                .underline(false)
                .emptyLine(1)
                .align('center')
                .size(3)
                .line(this.structureData.footer.textHoraUser)
                .line(this.structureData.footer.textSalida)
                .line(this.structureData.footer.textData)
        }

        codeSalida
            .size(3)

            .emptyLine(1)
            .cut()
        return codeSalida
    }

    async getTicketUnicode () {
        const salida = (await this.generateCodeSalida()).encode()
        this.pgs.print(salida)
    }
    async sendDataToDevice (data: Uint8Array): Promise<void> {
        await this.deviceService.write(data)
    }
    requestDevice () {
        this.deviceService.requestDevice()
    }
    print () {
        this.getTicketUnicode()
    }

    salidaToUnicode (salida: any) {}
}
