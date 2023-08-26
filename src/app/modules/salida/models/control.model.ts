import { DateTime } from 'luxon'
export interface DateroInterface {
    padron: number
    delta: number
}

export class ControlModel {
    id: number
    atras: DateroInterface[]
    control?: boolean
    datero: DateroInterface[]
    estado: string
    geocerca: number
    geocercaName?: string
    grabado: DateTime
    hora: DateTime
    liquidar?: boolean
    multa: number
    orden?: number
    ponderado: number
    real?: DateTime
    record: number
    roundVolada: number
    ruta: number
    salida: number
    tiempo: number
    volada: number
    constructor (control: ControlResponseInterface) {
        this.atras = control.atras.map(data => {
            if (data) {
                return {
                    padron: data[0],
                    delta: data[1]
                }
            } else {
                return null
            }
        })
        this.datero = control.datero.map(data => {
            return {
                padron: data[0],
                delta: data[1]
            }
        })
        this.estado = control.estado
        this.geocerca = control.geocerca
        this.grabado = DateTime.fromSQL(control.grabado)
        this.hora = DateTime.fromISO(control.hora)
        this.id = control.id
        this.multa = control.multa
        this.orden = control.orden
        this.ponderado = control.ponderado
        this.real = DateTime.fromISO(control.real)
        this.record = control.record
        this.roundVolada = control.roundVolada
        this.ruta = control.ruta
        this.salida = control.salida
        this.tiempo = control.tiempo
        this.volada = control.volada
    }
    parseDateroAtras () {
        if (this.atras) {
            return ''.concat(
                ...this.atras.map(d => {
                    if (d) {
                        return ' P' + d.padron + '(' + d.delta + ') '
                    } else {
                        return ''
                    }
                })
            )
        } else {
            return ''
        }
    }
    parseDateroAdelante () {
        if (this.datero) {
            return ''.concat(
                ...this.datero.map(d => {
                    if (d) {
                        return ' P' + d.padron + '(' + d.delta + ') '
                    } else {
                        return ''
                    }
                })
            )
        } else {
            return ''
        }
    }
    toFormat (): ControlFormatInterface {
        let real: string
        switch (this.estado) {
            case 'F':
                real = 'FM'
                break
            case 'N':
                real = 'NM'
                break
            case 'M':
                real = this.real.toFormat('HH:mm:ss')
                break
            default:
                real = '--:--:--'
        }
        return {
            id: this.id,
            atras: this.parseDateroAtras(),
            datero: this.parseDateroAdelante(),
            estado: this.estado,
            geocerca: this.geocerca,
            geocercaName: this.geocercaName,
            hora: this.hora.toFormat('HH:mm'),
            orden: this.orden,
            ponderado: this.ponderado,
            record: this.record,
            real: real,
            roundVolada: this.roundVolada
        }
    }
    toResponse (): ControlResponseInterface {
        return {
            id: this.id,
            atras: this.atras.map(data => [data.padron, data.delta]),
            datero: this.datero.map(data => [data.padron, data.delta]),
            estado: this.estado,
            geocerca: this.geocerca,
            grabado: this.grabado.toSQL(),
            hora: this.hora.toSQL(),
            multa: this.multa,
            orden: this.orden,
            ponderado: this.ponderado,
            record: this.record,
            real: this.real.toSQL(),
            roundVolada: this.roundVolada,
            ruta: this.ruta,
            salida: this.salida,
            tiempo: this.tiempo,
            volada: this.volada
        }
    }
    getString (tipo: string) {
        switch (this.estado) {
            case 'M':
                if (tipo === 'volada') {
                    return this.roundVolada
                } else if (tipo === 'hora') {
                    return this.real.toFormat('HH:mm:ss')
                } else if (tipo === 'datero') {
                    return this.datero[0]?.delta
                }
                break
            case 'N':
                return 'NM'
            case 'F':
                return 'FM'
            default:
                return ''
        }
    }
    setGeocerca (geocercas: GeocercaModel[]) {
        const geocerca = geocercas.find(g => g.id === this.geocerca)
        if (geocerca) {
            this.geocercaName = geocerca.nombre
            this.orden = geocerca.orden
            this.liquidar = geocerca.liquidar
            this.control = geocerca.control
        }
    }
    toSimpleResponse (): ControlSimpleResponseInterface {
        return {
            id: this.id,
            datero: [],
            estado: this.estado,
            geocerca: this.geocerca,
            record: this.record,
            real: this.real.toSQLTime(),
            roundVolada: this.roundVolada,
            salida: this.salida
        }
    }
}
export interface ControlFormatInterface {
    id: number
    atras: string
    datero: string
    estado: string
    geocerca: number
    geocercaName: string
    hora: string
    orden: number
    ponderado: number
    record: number
    real: string
    roundVolada: number
}

export interface ControlResponseInterface {
    id: number
    atras: any[]
    datero: any[]
    estado: string
    geocerca: number
    grabado: string
    hora: string
    multa: number
    orden: number
    ponderado: number
    record: number
    real: string
    roundVolada: number
    ruta: number
    salida: number
    tiempo: number
    volada: number
}

export interface ControlSimpleResponseInterface {
    id: number
    datero: any[]
    estado: string
    geocerca: number
    record: number
    real: string
    roundVolada: number
    salida: number
}

export class GeocercaModel {
    public id: number
    public activo: boolean
    public audio: string
    public control: boolean
    public datear: boolean
    public desde: DateTime
    public hasta: DateTime
    public info: boolean
    public lado: boolean
    public latitud: number
    public liquidar: boolean
    public longitud: number
    public metros: number
    public nombre: string
    public orden: number
    public radio: number
    public refrecuenciar: boolean
    public retorno: boolean
    public ruta: any
    public sagrado: boolean
    public terminal: boolean
    public center?: any
    public options?: any
    public leafletCircle: any
    constructor (geocerca: GeocercaResponseInterface) {
        this.id = geocerca.id
        this.activo = geocerca.activo
        this.audio = geocerca.audio
        this.control = geocerca.control
        this.datear = geocerca.datear
        this.desde = DateTime.fromISO(geocerca.desde)
        this.hasta = DateTime.fromISO(geocerca.hasta)
        this.lado = geocerca.lado
        this.latitud = geocerca.latitud
        this.liquidar = geocerca.liquidar
        this.longitud = geocerca.longitud
        this.metros = geocerca.metros
        this.nombre = geocerca.nombre
        this.orden = geocerca.orden
        this.radio = geocerca.radio
        this.refrecuenciar = geocerca.refrecuenciar
        this.retorno = geocerca.retorno
        this.ruta = geocerca.ruta
        this.sagrado = geocerca.sagrado
        this.terminal = geocerca.terminal
    }
    get desdeStr (): string {
        return this.desde.toSQLDate()
    }
    get hastaStr (): string {
        return this.hasta ? this.hasta.toSQLDate() : ''
    }
    get label (): string {
        return this.nombre
    }
    get ladoStr (): string {
        return this.lado ? 'B' : 'A'
    }
    get radioRound (): string {
        return this.radio.toFixed(0)
    }
    get rutaStr (): string {
        return this.ruta.codigo
    }

    setPopup () {
        this.leafletCircle.bindPopup(this.getTitle(), { offset: [0, -30] })
    }
    toForm () {
        return {
            id: this.id,
            audio: this.audio,
            control: this.control,
            datear: this.datear,
            lado: this.lado,
            latitud: this.latitud,
            // liquidar: this.liquidar,
            longitud: this.longitud,
            metros: this.metros,
            nombre: this.nombre,
            orden: this.orden,
            radio: this.radio,
            refrecuenciar: this.refrecuenciar,
            retorno: this.retorno,
            ruta: this.ruta.id,
            sagrado: this.sagrado,
            terminal: this.terminal
        }
    }

    getTitle (): string {
        return (
            `<b>GEOCERCA</b><br>` +
            `<b>NOMBRE:</b> ${this.nombre}<br>` +
            `<b>RUTA:</b> ${this.ruta.codigo}<br>` +
            `<b>LADO:</b> ${this.lado ? 'B' : 'A'}`
        )
    }
    toFilter () {
        return {
            activo: this.activo,
            ruta: this.ruta.id,
            lado: this.lado
        }
    }
}

export interface GeocercaResponseInterface {
    id: number
    activo: boolean
    audio: string
    control: boolean
    datear: boolean
    desde: string
    hasta: string
    info: boolean
    lado: boolean
    latitud: number
    liquidar: boolean
    longitud: number
    metros: number
    nombre: string
    orden: number
    radio: number
    refrecuenciar: boolean
    retorno: boolean
    ruta: number
    sagrado: boolean
    terminal: boolean
}
