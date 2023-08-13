import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'environments/environment'
import { Observable } from 'rxjs'
import { map, shareReplay, tap } from 'rxjs/operators'

// import { ConfiguracionesModel } from '../configuraciones/configuraciones-empresa/models/configuraciones.model'
// import { UserModel } from '../configuraciones/usuarios/models/user.model'
// import { MonedaInterface } from '../tesoreria/recaudo/caja/models/moneda.interface'
// import { ReciboModel } from './models/recibo.model'
// import { ReciboDetalleModel } from './models/recibo-detalle.model'
// import { ReciboDetalleResponseInterface } from './models/recibo-detalle-response.interface'
// import { ReciboResponseInterface } from './models/recibo-response.interface'
// import * as Helpers from 'app/shared/utils/helpers'
// import { CrudServiceAbstract } from '../..]/shared/components/async-crud-list/crud-service.abstract'

class Helpers {
    static numeroALetras (num: number, moneda: string) {
        const entero = Math.floor(num)
        const decimal = Math.round((num - entero) * 100)
        const letrasEntero = entero.toFixed(0).replace('.', ',')
        const letrasDecimal = decimal.toFixed(0).replace('.', ',')
        let letras = letrasEntero
        if (decimal > 0) {
            letras += ' CON ' + letrasDecimal + ' CENTAVOS'
        }
        return letras + ' ' + moneda
    }
}

import { DateTime } from 'luxon'
import { IMoneda, IRecibo } from './models/ticket.interface'
import {
    ReciboDetalleModel,
    ReciboModel,
    UserModel
} from './models/ticket.models'
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces'

class ConfiguracionesModel {
    id: number
    nombre: string
    valor: string
    json: any
}

@Injectable({
    providedIn: 'root'
})
export abstract class ReciboAbstractService {
    entities: string
    entity: string
    gender: boolean
    url: string
    imprimirNombre: ConfiguracionesModel
    imprimirTrabajador: ConfiguracionesModel
    ruc: ConfiguracionesModel
    empresa: ConfiguracionesModel
    direccion: ConfiguracionesModel
    codigo: ConfiguracionesModel
    configuracion: any = {
        pageMargins: [5, 20],
        pageSize: {
            width: 200,
            height: 'auto'
        },
        logo: {
            image: 'logo',
            fit: [200, 100],
            alignment: 'center'
        },
        qr: {
            fit: 70,
            alignment: 'center',
            eccLevel: 'M'
        },
        columnsCredito: ['*', 65],
        columnsDatos: [50, '*'],
        columnsDeudas: ['*', 40, 40],
        columnsFondos: ['*', 45],
        columnsItems: ['*', 35, 45],
        defaultStyle: {
            fontSize: 9,
            font: 'RobotoMono'
        },
        styles: {
            big: {
                fontSize: 12
            },
            bold: {
                bold: true
            },
            small: {
                fontSize: 8
            },
            'm-0': {
                margin: 0
            },
            header: {
                alignment: 'center',
                bold: true,
                fontSize: 12
            },
            footer: {
                alignment: 'center',
                fontSize: 8
            },
            total: {
                bold: true,
                fontSize: 11,
                alignment: 'right'
            }
        },
        nombreEmpresa: false,
        ruc: true,
        direccion: true
    }

    protected constructor (public http: HttpClient) {
        // super(http)
        this.entities = 'recibos'
        this.entity = 'recibo'
        this.gender = true
        this.url = 'api/recibos'
    }

    // configurarEmpresa (configs: ConfiguracionesModel[]) {
    //     this.imprimirNombre = configs.find(
    //         c => c.nombre === 'imprimir_nombres_tesoreria'
    //     )
    //     this.imprimirTrabajador = configs.find(
    //         c => c.nombre === 'imprimir_trabajador_tesoreria'
    //     )
    //     this.ruc = configs.find(c => c.nombre === 'ruc')
    //     this.empresa = configs.find(c => c.nombre === 'razon')
    //     this.codigo = configs.find(c => c.nombre === 'codigo')
    //     this.direccion = configs.find(c => c.nombre === 'direccion')
    //     // console.log('configuration ticket', this.configuracion);
    //     this.configuracion = {
    //         pageMargins: [20, 5],
    //         pageSize: {
    //             width: 225,
    //             height: 'auto'
    //         },
    //         logo: {
    //             image: 'logo',
    //             fit: [200, 100],
    //             alignment: 'center'
    //         },
    //         qr: {
    //             fit: 70,
    //             alignment: 'center',
    //             eccLevel: 'M'
    //         },
    //         columnsCredito: ['*', 65],
    //         columnsDatos: [50, '*'],
    //         columnsDeudas: ['*', 40, 40],
    //         columnsFondos: ['*', 45],
    //         columnsItems: ['*', 35, 45],
    //         defaultStyle: {
    //             fontSize: 9,
    //             fonts: 'RobotoMono'
    //         },
    //         styles: {
    //             big: {
    //                 fontSize: 12
    //             },
    //             bold: {
    //                 bold: true
    //             },
    //             small: {
    //                 fontSize: 8
    //             },
    //             'm-0': {
    //                 margin: 0
    //             },
    //             header: {
    //                 alignment: 'center',
    //                 bold: true,
    //                 fontSize: 12
    //             },
    //             footer: {
    //                 alignment: 'center',
    //                 fontSize: 8
    //             },
    //             total: {
    //                 bold: true,
    //                 fontSize: 11,
    //                 alignment: 'right'
    //             }
    //         },
    //         nombreEmpresa: false,
    //         ruc: true,
    //         direccion: true
    //     }
    // }

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

    DashedContent (): Content {
        return {
            table: {
                widths: ['*'],
                body: [['']]
            },
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 1) {
                        return 1
                    }
                },
                vLineWidth: function (i, node) {
                    return 0
                },
                hLineStyle: function (i, node) {
                    return { dash: { length: 6, space: 3 } }
                }
            }
        }
    }

    getTicketDefinition (
        data: ReciboDetalleModel
        // user: UserModel,
        // reimprimir = false
    ): TDocumentDefinitions {
        const datos = [[{ text: 'FECHA', style: 'bold' }, data.dia]]
        let deudas = []
        let fondos = []
        let pagos = []
        const headers = []
        const qr = []
        const logo = []
        const images = {}

        const items = data.items.map(d => [
            { text: d.stringRecibo, colSpan: 2 },
            '',
            { text: this.toCurrency(d.precio), alignment: 'right' }
        ])

        if (this.esContable(data)) {
            if (data.documento.sunat.codigo === 1) {
                datos.push([
                    { text: 'RUC', style: 'bold' },
                    data.cliente.ruc.toString()
                ])
            } else {
                datos.push([{ text: 'DNI', style: 'bold' }, data.cliente.dni])
            }

            datos.push([{ text: 'RAZÓN', style: 'bold' }, data.cliente.nombre])
            if (data.cliente.tipo === 'U') {
                datos.push([
                    { text: 'PADRÓN', style: 'bold' },
                    data.cliente.referencia
                ])
            }
            items.push([
                '',
                { text: 'GRAV.', alignment: 'right' },
                {
                    text: this.toCurrency(data.base, data.moneda),
                    alignment: 'right'
                }
            ])
            items.push([
                '',
                { text: 'IGV', alignment: 'right' },
                {
                    text: this.toCurrency(data.igv, data.moneda),
                    alignment: 'right'
                }
            ])
            if (this.ruc) {
                images[
                    'logo'
                ] = `https://th.bing.com/th/id/OIP.8iPrqe8wy_NK3_Pldb0V4AHaGB?pid=ImgDet&rs=1`
                logo.push(this.configuracion.logo)
                qr.push({
                    text:
                        'SON: ' +
                        Helpers.numeroALetras(
                            Math.abs(data.total),
                            data.monedaTextos
                        ),
                    style: 'small'
                })
                qr.push({
                    text: `Forma de Pago: ${
                        data.efectivo ? 'CONTADO' : 'CREDITO'
                    }`
                })
                qr.push({
                    // qr: this.ruc.data + data.getQR(),
                    qr: this.ruc,
                    fit: this.configuracion.qr.fit,
                    alignment: this.configuracion.qr.alignment,
                    eccLevel: this.configuracion.qr.eccLevel
                })
                if (this.configuracion.nombreEmpresa) {
                    headers.push({
                        text: this.empresa?.nombre,
                        style: 'header'
                    })
                }
                if (this.configuracion.ruc) {
                    headers.push({
                        text: 'RUC: ' + this.ruc?.nombre,
                        alignment: 'center'
                    })
                }
                if (this.configuracion.direccion) {
                    headers.push({
                        text: this.direccion?.nombre,
                        style: 'footer'
                    })
                }
            }
        } else {
            datos.push([
                { text: 'CLIENTE', style: 'bold' },
                data.cliente.nombre
            ])
            if (data.conductor) {
                datos.push([{ text: 'COND', style: 'bold' }, data.conductor])
            }
            if (data.deudas.length > 0) {
                deudas = [
                    {
                        style: 'm-0',
                        layout: 'lightHorizontalLines',
                        table: {
                            headerRows: 1,
                            widths: this.configuracion.columnsDeudas,
                            body: [
                                [
                                    { text: 'DEUDA', style: 'bold' },
                                    {
                                        text: 'INICIAL',
                                        style: 'bold',
                                        alignment: 'right'
                                    },
                                    {
                                        text: 'SALDO',
                                        style: 'bold',
                                        alignment: 'right'
                                    }
                                ],
                                ...data.deudas.map(d => [
                                    {
                                        text:
                                            d.nombre +
                                            this.shortDia(d.dia) +
                                            ' ' +
                                            this.toCurrency(
                                                d.inicial,
                                                data.moneda
                                            ),
                                        colSpan: 2
                                    },
                                    '',
                                    {
                                        text: this.toCurrency(d.saldo),
                                        alignment: 'right'
                                    }
                                ])
                            ]
                        }
                    }
                ]
            }
            if (data.fondos.length > 0) {
                fondos = [
                    {
                        style: 'm-0',
                        layout: 'lightHorizontalLines',
                        table: {
                            headerRows: 1,
                            widths: this.configuracion.columnsFondos,
                            body: [
                                [
                                    { text: 'FONDO', style: 'bold' },
                                    {
                                        text: 'TOTAL',
                                        style: 'bold',
                                        alignment: 'right'
                                    }
                                ],
                                ...data.fondos.map(d => [
                                    d.nombre,
                                    {
                                        text: this.toCurrency(
                                            d.total,
                                            data.moneda
                                        ),
                                        alignment: 'right'
                                    }
                                ])
                            ]
                        }
                    }
                ]
            }
        }
        if (data.saldo) {
            pagos = [
                {
                    style: 'm-0',
                    layout: 'noBorders',
                    table: {
                        headerRows: 0,
                        widths: this.configuracion.columnsCredito,
                        body: [
                            [
                                { text: 'EN EFECTIVO', style: 'bold' },
                                {
                                    text: (data.total - data.saldo).toFixed(2),
                                    alignment: 'right'
                                }
                            ],
                            [
                                { text: 'AL CREDITO', style: 'bold' },
                                {
                                    text: data.saldo.toFixed(2),
                                    alignment: 'right'
                                }
                            ],
                            ['', ''],
                            ['', ''],
                            ['', ''],
                            ['', ''],
                            ['', ''],
                            ['', ''],
                            ['', ''],
                            [
                                {
                                    text: '________________________',
                                    style: 'bold',
                                    colSpan: 2,
                                    alignment: 'center'
                                }
                            ],
                            [
                                {
                                    text: 'FIRMA y DNI',
                                    style: 'bold',
                                    colSpan: 2,
                                    alignment: 'center'
                                }
                            ]
                        ]
                    }
                }
            ]
        }
        if (data.cliente.direccion) {
            datos.push([
                { text: 'DIRECC', style: 'bold' },
                data.cliente.direccion
            ])
        }
        if (data.observacion) {
            datos.push([{ text: 'PLACA', style: 'bold' }, data.observacion])
        }
        headers.push({
            text: data?.documento?.nombre,
            style: 'header'
        })
        headers.push({
            text: `${data.serie} - ${data.numero}`,
            style: 'header'
        })
        const dashContent = this.DashedContent()

        const content: Content = [
            ...logo,
            ...headers,
            dashContent,
            {
                style: 'm-0',
                layout: 'noBorders',
                lineHeight: 0.8,
                table: {
                    headerRows: 1,
                    widths: this.configuracion.columnsDatos,
                    body: datos
                }
            },
            dashContent,
            {
                style: 'm-0',
                // layout: 'lightHorizontalLines',
                layout: 'noBorders',
                columnGap: 0.5,
                // characterSpacing: 1,
                lineHeights: 0.7,

                table: {
                    headerRows: 1,
                    widths: this.configuracion.columnsItems,
                    body: [
                        [
                            { text: 'DESCRIPCIÓN', style: 'bold' },
                            { text: 'CANT', style: 'bold', alignment: 'right' },
                            { text: 'TOTAL', style: 'bold', alignment: 'right' }
                        ],
                        ...items,
                        [
                            { text: 'TOTAL', style: 'total' },
                            {
                                text: this.toCurrency(data.total, data.moneda),
                                style: 'total',
                                colSpan: 2
                            }
                        ]
                    ]
                }
            },
            dashContent,
            ...fondos,
            ...deudas,
            ...pagos,
            ...qr,
            {
                text: this.direccion?.nombre,
                style: 'footer'
            }
        ]
        let height = this.calcHeight(content)
        const minHeight =
            this.configuracion.minHeight ||
            this.configuracion.pageSize.width + 20
        if (height < minHeight) {
            let diff = minHeight - height
            while (diff > 0) {
                content.push(`
          `)
                diff -= this.configuracion.defaultStyle.fontSize + 12
                height += this.configuracion.defaultStyle.fontSize + 12
                // console.log('añadiendo espacio', height, minHeight, diff);
            }
        }
        return {
            pageSize: this.configuracion.pageSize,
            pageOrientation: 'portrait',
            content: content,
            pageMargins: this.configuracion.pageMargins,
            styles: this.configuracion.styles,
            defaultStyle: {
                fontSize: 9,
                font: 'RobotoMono',
                characterSpacing: 0,
                preserveLeadingSpaces: true
            },
            images
        }
    }

    private calcHeight (content) {
        // console.log('content', content);
        let height = 10
        content.forEach(item => {
            // console.log(item, height);
            if (item.style === 'header') {
                console.log('style', this.configuracion)
                height += this.configuracion.styles.header.fontSize + 3
                // item.text?.split('\n').length *
                // (this.configuracion.styles.header.fontSize + 3)
            } else if (item.style === 'footer') {
                height += this.configuracion.styles.footer.fontSize + 3
                // item?.text.split('\n').length *
                // (this.configuracion.styles.footer.fontSize + 3)
            } else if (item.table) {
                height +=
                    item.table.body.length *
                    (this.configuracion.defaultStyle.fontSize + 6)
                // } else if (item.table) {
                //   height += (item.text.split('\n').length + 1) * this.configuracion.defaultStyle.fontSize + 13;
            } else if (item.image) {
                height += item.fit[1]
            } else {
                height += this.configuracion.defaultStyle.fontSize + 3
            }
        })
        return height
    }

    private esContable (data: ReciboDetalleModel) {
        return (
            data.documento?.sunat?.codigo === 1 ||
            data.documento?.sunat?.codigo === 3 ||
            data.documento?.sunat?.codigo === 7
        )
    }

    fromInterfaceToAbstract = (data: IRecibo): ReciboModel =>
        new ReciboModel(data)
}
