import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
    BoletajeModel,
    ConfiguracionesModel,
    RutaModel,
    SalidaCompletaModel,
    SalidaModel
} from './models/salida.model'
import { GeocercaModel } from './models/control.model'
import { UserModel } from '../recibo/models/reciboDetalle.models'
import { BehaviorSubject, Observable, map, take, tap } from 'rxjs'
import {
    IBoletaje,
    ISalida,
    SalidaCompletaResponseInterface
} from './models/salida.interface'
import { DateTime } from 'luxon'

@Injectable({
    providedIn: 'root'
})
export class SalidaService {
    private _ruta: RutaModel
    get ruta (): RutaModel {
        return this._ruta
    }
    set ruta (r) {
        this._ruta = r
    }
    private _geocercas: GeocercaModel[]
    get geocercas (): GeocercaModel[] {
        return this._geocercas
    }
    set geocercas (g) {
        this._geocercas = g
    }
    private _user: UserModel
    get user (): UserModel {
        return this._user
    }
    set user (u: UserModel) {
        this._user = u
    }
    public item$ = new BehaviorSubject<SalidaModel>(null)
    public salidaId$ = new BehaviorSubject<number>(null)
    private companyName: ConfiguracionesModel
    private imprimirNombre: ConfiguracionesModel
    private imprimirCodigo: ConfiguracionesModel
    constructor (private http: HttpClient) {}
    getLadoString (lado: boolean | null): string {
        return lado === true ? 'B' : lado === false ? 'A' : 'A y B'
    }
    configurarEmpresa (configs: ConfiguracionesModel[]) {
        this.imprimirNombre = configs.find(
            c => c.nombre === 'imprimir_nombres_despacho'
        )
        this.imprimirCodigo = configs.find(
            c => c.nombre === 'imprimir_codigos_despacho'
        )
        this.companyName = configs.find(c => c.nombre === 'nombre')
    }

    fallaMecanica (
        salida: number,
        motivo: string
    ): Observable<SalidaCompletaModel> {
        return this.http
            .put<SalidaCompletaResponseInterface>(
                `api/salidas/falla_mecanica`,
                { salida: salida, motivo: motivo }
            )
            .pipe(map(item => new SalidaCompletaModel(item)))
    }
    finalize (data): Observable<SalidaCompletaModel> {
        return this.http
            .put<SalidaCompletaResponseInterface>(`finalizar`, data)
            .pipe(map(item => new SalidaCompletaModel(item)))
    }
    getTicket (data: SalidaCompletaModel, imprimirLiquidacion: boolean): any {
        data.controles.forEach(c => c.setGeocerca(this.geocercas))
        const controles = data.controles.filter(c => c.control)
        let personal = []
        if (this.imprimirNombre && this.imprimirNombre.data === 'false') {
            if (this.imprimirCodigo && this.imprimirCodigo.data === 'false') {
                // personal = [];
            } else {
                personal = [
                    [
                        'COND',
                        data.getConductorName(this.imprimirNombre).slice(0, 7),
                        'COBR',
                        data.getCobradorName(this.imprimirNombre).slice(0, 7)
                    ]
                ]
            }
        } else {
            personal = [
                [
                    'COND',
                    {
                        text: data.getConductorName(this.imprimirNombre),
                        colSpan: 3
                    }
                ],
                [
                    'COBR',
                    {
                        text: data.getCobradorName(this.imprimirNombre),
                        colSpan: 3
                    }
                ]
            ]
        }
        const header = {
            style: 'table',
            layout: 'noBorders',
            table: {
                headerRows: 0,
                widths: [30, 55, 35, 55],
                body: [
                    [
                        'RUTA',
                        this.ruta.codigo,
                        'LADO',
                        `${this.getLadoString(data.lado)} ${data.vuelta / 2}`
                    ],
                    [
                        'DIA',
                        data.inicio.toFormat('yy-MM-dd'),
                        'PLACA',
                        data.placa
                    ],
                    ...personal,
                    [
                        'PAD',
                        { text: data.padron, style: 'resaltado' },
                        {
                            text: `F${data.frecuencia}`,
                            style: 'resaltado'
                        },
                        {
                            text: data.inicio.toFormat('HH:mm'),
                            style: 'resaltado'
                        }
                    ]
                ]
            }
        }
        const content: any[] = [
            {
                text: this.companyName.data,
                style: 'header'
            },
            header,
            {
                style: 'table',
                layout: 'borders',
                table: {
                    headerRows: 1,
                    widths: ['*', 50],
                    body: [
                        [
                            { text: 'CTRLS', style: 'tableHeader' },
                            { text: 'HORA', style: 'tableHeader' }
                        ],
                        ...controles.map(d => [
                            d.geocercaName.slice(0, 20),
                            {
                                text: d.hora.toFormat('HH:mm'),
                                alignment: 'center'
                            }
                        ])
                    ]
                }
            }
        ]
        if (data.unidad.suministros.length > 0 && imprimirLiquidacion) {
            content.push({
                text: 'LIQUIDACION DE BOLETOS',
                style: 'header'
            })
            content.push({
                style: 'table',
                layout: 'noBorders',
                table: {
                    headerRows: 0,
                    widths: [25, 25, 30, '*'],
                    body: [
                        [
                            'PAD',
                            data.padron,
                            'HORA',
                            data.inicio.toFormat('HH:mm')
                        ]
                    ]
                }
            })
            content.push({
                style: 'table',
                layout: 'borders',
                table: {
                    headerRows: 1,
                    widths: [19, '*', 30, 30, 30],
                    body: [
                        [{ text: 'INSPECT', colSpan: 2 }, '', '', '', ''],
                        [{ text: 'LUGAR', colSpan: 2 }, '', '', '', ''],
                        [{ text: 'HORA', colSpan: 2 }, '', '', '', ''],
                        ...data.unidad.suministros.map(s => {
                            const tacos = Math.floor((s.fin - s.actual) / 100)
                            let inicio =
                                s.actual.toString().padStart(6, '0') +
                                `-${tacos}`
                            if (tacos === 0) {
                                inicio = s.actual.toString().padStart(6, '0')
                            }
                            return [
                                s.boleto.tarifa.toFixed(1),
                                inicio,
                                '',
                                '',
                                ''
                            ]
                        })
                    ]
                }
            })
        }
        content.push({
            text:
                `${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')} ` +
                `${this.user.username.toUpperCase()} ` +
                `SALIDA: ${data.id} Sistema de Gestion TCONTUR`,
            alignment: 'center'
        })
        return {
            pageSize: {
                width: 225,
                height: 'auto'
            },
            pageOrientation: 'portrait',
            content: content,
            pageMargins: [10, 5],
            styles: {
                header: {
                    alignment: 'center'
                },
                table: {
                    margin: [0, 1, 0, 1]
                },
                tableHeader: {
                    bold: true,
                    color: 'black'
                },
                resaltado: {
                    bold: true,
                    fontSize: 16,
                    color: 'black'
                }
            },
            defaultStyle: {
                fontSize: 11
            }
        }
    }
    writeRotatedText (text) {
        const canvas = document.createElement('canvas')
        // I am using predefined dimensions so either make this part of the arguments or change at will
        // const canvas = ctxCanvas[1];
        canvas.width = 36
        canvas.height = 270
        const ctx = canvas.getContext('2d')
        ctx.font = '36pt Arial'
        ctx.save()
        ctx.translate(36, 270)
        ctx.rotate(-0.5 * Math.PI)
        ctx.fillStyle = '#000'
        ctx.fillText(text, 0, 0)
        ctx.restore()
        return canvas.toDataURL()
    }

    getSalidaCompleta (data?: number): Observable<SalidaCompletaModel> {
        return this.http
            .get<SalidaCompletaResponseInterface>(`api/apps/salida`)
            .pipe(
                map(item => new SalidaCompletaModel(item)),
                take(1)
            )
    }
    printVoladas (salidaId: number): void {
        this.http
            .get(`api/salidas/${salidaId}/pdf?reporte=voladas`, {
                responseType: 'blob'
            })
            .subscribe(data => {
                const blob = new Blob([data], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                window.open(url, '_blank')
            })
    }

    getSalida (id: number): Observable<SalidaModel> {
        return this.http.get<ISalida>(`api/salidas/${id}`).pipe(
            map(item => new SalidaModel(item)),
            tap(item => this.item$.next(item))
        )
    }
    setSalida (salida: number) {
        this.salidaId$.next(salida)
    }
    regresar (salida: number, motivo: string): Observable<ISalida> {
        return this.http.put<ISalida>(`api/salidas/regresar`, {
            motivo,
            salida
        })
    }
    printTicketLiquidacion (salidaId: number): void {
        this.http
            .get(`api/salidas/${salidaId}/pdf?reporte=liquidacion`, {
                responseType: 'blob'
            })
            .subscribe(data => {
                const blob = new Blob([data], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                const myWindow = window.open(url, '_blank')
                myWindow.print()
            })
    }
    printTicketDespacho (salidaId: number): void {
        this.http
            .get(`api/salidas/${salidaId}/pdf?reporte=despacho`, {
                responseType: 'blob'
            })
            .subscribe(data => {
                const blob = new Blob([data], { type: 'application/pdf' })
                const url = window.URL.createObjectURL(blob)
                const myWindow = window.open(url, '_blank')
                myWindow.print()
            })
    }
    corregirBoletaje (form: {
        boletaje: number
        fin: number
        inicio: number
        motivo: string
        salida: number
    }): Observable<BoletajeModel> {
        return this.http
            .put<IBoletaje>(`api/salidas/corregir_boletaje`, form)
            .pipe(map(item => new BoletajeModel(item)))
    }
}
