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
import { ToastrService } from 'ngx-toastr'
import { TableStructure } from '../utils/anchoConfig.interface'
import { estructureFor48 } from '../utils/withCol48'
import { estructureFor32 } from '../utils/withCol32'

@Component({
    selector: 'app-salida-view',
    templateUrl: './salida-view.component.html',
    styleUrls: ['./salida-view.component.scss']
})
export class SalidaViewComponent implements OnInit {
    SelectPaperConfigStructure: TableStructure = null

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
        private pgs: PrintGeneralService,
        private toastr: ToastrService
    ) {}
    private imprimirNombre: ConfiguracionesModel
    private imprimirCodigo: ConfiguracionesModel

    salidaData: SalidaCompletaModel

    ngOnInit () {
        this.geocercaService.getGeocercaData().subscribe(data => {
            this.geocercas = data
        })

        this.salidaService.getSalidaCompleta().subscribe(data => {
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
                rutaLado: [],
                condCobr: [],
                padHora: []
            },
            body: {
                liqBoletos: '',
                padHora2: [],
                suministrosHead: [],
                suministrosBody: [],
                controles: []
            },
            footer: {
                textHoraUser: '',
                textSalida: '',
                textData: ''
            }
        }

        salida.controles.forEach(c => c.setGeocerca(this.geocercas))
        const controles = salida.controles.filter(c => c.control)
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

        finalSalidaData.header.rutaLado = [
            [
                'RUTA',
                this.ruta.codigo,
                'LADO',
                `${this.getLadoString(salida.lado)} ${salida.vuelta / 2}`
            ],
            ['DIA', salida.inicio.toFormat('yy-MM-dd'), 'PLACA', salida.placa]
        ]

        finalSalidaData.header.condCobr = personal

        finalSalidaData.header.padHora = [
            [
                'PAD',
                salida.padron + '',
                `F${salida.frecuencia}`,
                salida.inicio.toFormat('HH:mm')
            ]
        ]

        const crls = controles.map(d => [
            d.geocercaName.slice(0, 20),
            d.hora.toFormat('HH:mm')
        ])
        finalSalidaData.body.controles = [
            // ['', '', '', '', ''],

            ['CONTROL', 'HORA'],
            ...crls
        ]

        if (salida.unidad.suministros.length > 0 && imprimirLiquidacion) {
            finalSalidaData.body.liqBoletos = 'LIQUIDACION DE BOLETOS'
            finalSalidaData.body.padHora2 = [
                [
                    'PAD',
                    salida.padron + '',
                    'HORA',
                    salida.inicio.toFormat('HH:mm')
                ]
            ]
            finalSalidaData.body.suministrosHead = [
                ['INSPECT'],
                ['LUGAR'],
                ['HORA']
            ]

            finalSalidaData.body.suministrosBody = [
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
        this.dataForPrint = finalSalidaData
    }

    generateCodeSalida (): EscPosEncoder {
        const valueUnderline = this.pgs.withPrint
            ? this.pgs.withPrint === WithPrint.MM80
                ? 2
                : false
            : true

        const codeSalida = new EscPosEncoder()
            .align('center')
            .codepage('windows1251')
            .size(3)
            .underline(false)

        if (this.dataForPrint.header.textCompany) {
            codeSalida.line(this.dataForPrint.header.textCompany).emptyLine(1)
        }

        if (this.dataForPrint.header.rutaLado) {
            codeSalida.align('left').table(
                this.SelectPaperConfigStructure.colRutaLado.map(item => ({
                    width: item.w
                })),
                [...this.dataForPrint.header.rutaLado]
            )
        }
        if (this.dataForPrint.header.condCobr) {
            codeSalida.align('left').table(
                this.SelectPaperConfigStructure.colCondCobr.map(items => ({
                    width: items.w
                })),
                [...this.dataForPrint.header.condCobr]
            )
        }
        if (this.dataForPrint.header.padHora) {
            codeSalida.size(2).table(
                this.SelectPaperConfigStructure.colPadHora.map(item => ({
                    width: item.w,
                    align: item.a ? item.a : 'center'
                })),
                [...this.dataForPrint.header.padHora]
            )
        }
        if (this.dataForPrint.body.controles) {
            console.log(this.dataForPrint.body.controles)
            const controlesTable = this.dataForPrint.body.controles.map(item =>
                this.dataToTablePos(item, 5)
            )

            codeSalida
                .size(3)
                .underline(valueUnderline)
                .bold(false)

                .underline(valueUnderline)
                .table(
                    this.SelectPaperConfigStructure.colControles.map(item => ({
                        width: item.w,
                        align: item.a ? item.a : 'center'
                    })),
                    [['', '', '', '', ''], ...controlesTable]
                )
                .underline(false)
        }

        if (this.dataForPrint.body.liqBoletos) {
            codeSalida
                .emptyLine(1)
                .align('center')
                .bold(true)
                .size(3)
                .line(this.dataForPrint.body.liqBoletos)
        }

        if (this.dataForPrint.body.padHora2) {
            codeSalida.size(3).table(
                this.SelectPaperConfigStructure.colPadHora2.map(item => ({
                    width: item.w,
                    align: item.a ? item.a : 'center'
                })),
                [...this.dataForPrint.body.padHora2]
            )
        }

        if (this.dataForPrint.body.suministrosBody) {
            const columsT9 = this.dataForPrint.body.suministrosHead.map(s =>
                this.dataToTablePos(s, 9)
            )

            const columnT11sum = this.dataForPrint.body.suministrosBody.map(s =>
                this.dataToTablePos(s, 11)
            )
            codeSalida
                .bold(false)
                .align('left')
                .size(3)
                .underline(valueUnderline)
                .table(
                    this.SelectPaperConfigStructure.colSumHead.map(item => ({
                        width: item.w
                    })),

                    [['', '', '', '', '', '', '', '', ''], ...columsT9]
                )
                .table(
                    this.SelectPaperConfigStructure.colSumBody.map(item => ({
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

        codeSalida.size(3).cut()
        return codeSalida
    }

    getTicketUnicode () {
        if (!this.pgs.withPrint) {
            this.toastr.warning('Seleccione el ancho de impresión')
            return
        }
        if (this.pgs.withPrint === WithPrint.MM80) {
            this.SelectPaperConfigStructure = estructureFor48
        } else if (this.pgs.withPrint === WithPrint.MM58) {
            this.SelectPaperConfigStructure = estructureFor32
        }
        if (!this.pgs.withPrint) {
            console.log('No se ha seleccionado el tamaño de papel')
        }
        const salida = this.generateCodeSalida().encode()
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
        const inUserSymbol = this.pgs.withPrint
            ? this.pgs.withPrint === WithPrint.MM80
                ? '|'
                : ''
            : '|'
        for (let i = 0; i < numColumns; i++) {
            if (i % 2 === 0) {
                transformedData.push(inUserSymbol) // Añadir celda vacía entre datos
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
