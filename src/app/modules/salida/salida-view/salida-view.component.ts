/// <reference types="@types/w3c-web-usb" />

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
import {
    PrintGeneralService,
    WithPrint
} from 'app/modules/print-general/print-general.service'
import { map } from 'rxjs'
import { SalidaPos } from '../utils/salidaData.interface'

@Component({
    selector: 'app-salida-view',
    templateUrl: './salida-view.component.html',
    styleUrls: ['./salida-view.component.scss']
})
export class SalidaViewComponent implements OnInit {
    // printerType: PrinterType[] = [PrinterType['58mm'], PrinterType['80mm']]

    // selectedPrinterType = PrinterType['58mm']
    estructureFor32 = {
        T4D1width: [{ w: 8 }, { w: 12 }, { w: 8 }, { w: 4 }],
        T2D2width: [{ w: 8 }, { w: 24 }],
        T4D3width: [{ w: 3 }, { w: 3 }, { w: 3 }, { w: 3, a: 'right' }],
        T5Cwidth: [
            { w: 2, a: 'left' },
            { w: 20, a: 'center' },
            { w: 2, a: 'center' },
            { w: 5, a: 'center' },
            { w: 1, a: 'right' }
        ],
        T4PHwidth: [
            { w: 3, a: 'left' },
            { w: 3, a: 'left' },
            { w: 3, a: 'right' },
            { w: 3, a: 'right' }
        ],
        T9SHwidth: [
            { w: 1 },
            { w: 14 },
            { w: 1 },
            { w: 4 },
            { w: 1 },
            { w: 4 },
            { w: 1 },
            { w: 4 },
            { w: 1 }
        ],
        T11SBwidth: [
            { w: 1 },
            { w: 4 },
            { w: 1 },
            { w: 9 },
            { w: 1 },
            { w: 4 },
            { w: 1 },
            { w: 4 },
            { w: 1 },
            { w: 4 },
            { w: 1 }
        ]
    }

    SelectPaperConfigStructure = null

    estructureFor48 = {
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
        T11SBwidth: [
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
    dataForPrint: SalidaPos
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
            // console.log('geocercas', data)
            this.geocercas = data
        })

        this.salidaService.getSalidaCompleta().subscribe(data => {
            // console.log('data', data)
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
        let finalSalidaData: SalidaPos = {
            header: {
                textCompany: '',
                table4Data1: [],
                table2Data2: [],
                table4Data3: []
            },
            body: {
                textLiqTitle: '',
                table4PadHora: [],
                table9SumHeader: [],
                table9Suministros: [],
                table5Controles: []
            },
            footer: {
                textHoraUser: '',
                textSalida: '',
                textData: ''
            }
        }

        salida.controles.forEach(c => c.setGeocerca(this.geocercas))
        const controles = salida.controles.filter(c => c.control)
        // console.log(this.geocercas)
        // console.log('controles', controles, salida.controles)
        let personal = []

        finalSalidaData.header.textCompany = this.company.data
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

        finalSalidaData.header.table4Data1 = [
            [
                'RUTA',
                this.ruta.codigo,
                'LADO',
                `${this.getLadoString(salida.lado)} ${salida.vuelta / 2}`
            ],
            ['DIA', salida.inicio.toFormat('yy-MM-dd'), 'PLACA', salida.placa]
        ]

        finalSalidaData.header.table2Data2 = personal

        finalSalidaData.header.table4Data3 = [
            [
                'PAD',
                salida.padron + '',
                `F${salida.frecuencia}`,
                salida.inicio.toFormat('HH:mm')
            ]
        ]

        // const crls = controles.map(d => [
        //     '|',
        //     d.geocercaName.slice(0, 20),
        //     '|',
        //     d.hora.toFormat('HH:mm'),
        //     '|'
        // ])
        const crls = controles.map(d => [
            d.geocercaName.slice(0, 20),
            d.hora.toFormat('HH:mm')
        ])

        console.log('crls', crls)
        finalSalidaData.body.table5Controles = [
            // ['', '', '', '', ''],

            ['CONTROL', 'HORA'],
            ...crls
        ]
        console.log(finalSalidaData.body.table5Controles)

        if (salida.unidad.suministros.length > 0 && imprimirLiquidacion) {
            finalSalidaData.body.textLiqTitle = 'LIQUIDACION DE BOLETOS'
            finalSalidaData.body.table4PadHora = [
                [
                    'PAD',
                    salida.padron + '',
                    'HORA',
                    salida.inicio.toFormat('HH:mm')
                ]
            ]
            finalSalidaData.body.table9SumHeader = [
                ['INSPECT'],
                ['LUGAR'],
                ['HORA']
            ]

            finalSalidaData.body.table9Suministros = [
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

        finalSalidaData.footer.textHoraUser = `${DateTime.now().toFormat(
            'HH:mm:ss'
        )} ${this.user.username.toUpperCase()}`
        finalSalidaData.footer.textSalida = `SALIDA: ${salida.id}`
        finalSalidaData.footer.textData = `Sistema de Gestion TCONTUR`

        console.log('structureData', finalSalidaData)
        console.log(
            finalSalidaData.body.table9SumHeader,
            finalSalidaData.body.table9Suministros.map(s =>
                this.dataToTablePos(s, 11)
            )
        )

        this.dataForPrint = finalSalidaData
    }

    async generateCodeSalida (): Promise<EscPosEncoder> {
        const codeSalida = new EscPosEncoder()
            .align('center')
            .size(3)
            .underline(false)

        if (this.dataForPrint.header.textCompany) {
            codeSalida.line(this.dataForPrint.header.textCompany).emptyLine(1)
        }

        if (this.dataForPrint.header.table4Data1) {
            codeSalida.align('left').table(
                this.SelectPaperConfigStructure.T4D1width.map(item => ({
                    width: item.w
                })),
                [...this.dataForPrint.header.table4Data1]
            )
        }
        if (this.dataForPrint.header.table2Data2) {
            codeSalida.align('left').table(
                this.SelectPaperConfigStructure.T2D2width.map(items => ({
                    width: items.w
                })),
                [...this.dataForPrint.header.table2Data2]
            )
        }
        if (this.dataForPrint.header.table4Data3) {
            codeSalida.size(2).table(
                this.SelectPaperConfigStructure.T4D3width.map(item => ({
                    width: item.w,
                    align: item.a ? item.a : 'center'
                })),
                [...this.dataForPrint.header.table4Data3]
            )
        }
        if (this.dataForPrint.body.table5Controles) {
            console.log(this.dataForPrint.body.table5Controles)
            const controlesTable = this.dataForPrint.body.table5Controles.map(
                item => this.dataToTablePos(item, 5)
            )
            console.log('controlesTable', controlesTable)
            console.log(this.dataForPrint.body.table5Controles)

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
                    [...controlesTable]
                )
                .underline(false)
        }

        if (this.dataForPrint.body.textLiqTitle && false) {
            codeSalida
                .emptyLine(1)
                .align('center')
                .bold(true)
                .size(3)
                .line(this.dataForPrint.body.textLiqTitle)
        }

        if (this.dataForPrint.body.table4PadHora) {
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
                [...this.dataForPrint.body.table4PadHora]
            )
        }

        if (this.dataForPrint.body.table9Suministros) {
            const columsT9 = this.dataForPrint.body.table9SumHeader.map(s =>
                this.dataToTablePos(s, 9)
            )

            const columnT11sum = this.dataForPrint.body.table9Suministros.map(
                s => this.dataToTablePos(s, 11)
            )
            console.log('asdddddddd', this.dataForPrint.body.table9Suministros)
            console.log('columsT9', columnT11sum)
            console.log('columsT9', columsT9)
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
                    this.SelectPaperConfigStructure.T11SBwidth.map(item => ({
                        width: item.w
                    })),

                    columnT11sum
                )
        }

        if (this.dataForPrint.footer.textHoraUser) {
            codeSalida
                .underline(false)
                .emptyLine(1)
                .align('center')
                .size(3)
                .line(this.dataForPrint.footer.textHoraUser)
                .line(this.dataForPrint.footer.textSalida)
                .line(this.dataForPrint.footer.textData)
        }

        codeSalida.size(3).emptyLine(1).cut()
        return codeSalida
    }

    async getTicketUnicode () {
        if (this.pgs.withPrint === WithPrint.MM80) {
            this.SelectPaperConfigStructure = this.estructureFor48
        } else if (this.pgs.withPrint === WithPrint.MM58) {
            this.SelectPaperConfigStructure = this.estructureFor32
        }
        if (!this.pgs.withPrint) {
            console.log('No se ha seleccionado el tamaño de papel')
        }
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
    dataToTablePos (
        data: string[],
        numColumns: number,
        empySpace?: string
    ): string[] {
        const transformedData: string[] = []

        for (let i = 0; i < numColumns; i++) {
            if (i % 2 === 0) {
                transformedData.push('|') // Añadir celda vacía entre datos
            } else {
                const dataIndex = Math.floor(i / 2)
                if (dataIndex < data.length) {
                    transformedData.push(` ${data[dataIndex]}`)
                } else {
                    transformedData.push(empySpace ? empySpace : '') // Añadir celda vacía si no hay más datos
                }
            }
        }

        return transformedData
    }
    salidaToUnicode (salida: any) {}
}
