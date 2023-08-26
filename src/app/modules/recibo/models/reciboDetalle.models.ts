import { DateTime } from 'luxon'
import {
    IAbono,
    IAlmacen,
    ICaja,
    ICliente,
    IDeuda,
    IDocumento,
    IItem,
    IMoneda,
    IProducto,
    IRecibo,
    ISede,
    ISunat,
    IReciboDetalle,
    IUser,
    IConductor
} from './reciboDetalle.interface'

export class ReciboDetalleModel {
    id: number
    abono: AbonoModel
    anulado: boolean
    base: number
    caja: CajaModel
    cliente: ClienteModel
    conductor: ConductorModel
    dia: string
    deuda: null
    deudas: DeudaModel[]
    documento: DocumentoModel
    efectivo: boolean
    fondos: any[]
    hora: DateTime
    igv: number
    items: ItemModel[]
    inafecta: number
    modifica: null
    moneda: MonedaModel
    numero: string
    observacion: null
    pagado: boolean
    saldo: number
    sended: boolean
    serie: string
    ser_num: string
    total: number
    usuario: number

    constructor (data: IReciboDetalle) {
        this.id = data.id
        this.abono = data.abono ? new AbonoModel(data.abono) : null
        this.anulado = data.anulado
        this.base = data.base
        this.caja = data.caja ? new CajaModel(data.caja) : null
        this.cliente = data.cliente ? new ClienteModel(data.cliente) : null
        this.conductor = data.conductor
            ? new ConductorModel(data.conductor)
            : null
        this.dia = data.dia
        this.deuda = data.deuda
        this.deudas = data.deudas.map(deuda => new DeudaModel(deuda))
        this.documento = data.documento
            ? new DocumentoModel(data.documento)
            : null
        this.efectivo = data.efectivo
        this.fondos = data.fondos
        this.hora = DateTime.fromISO(data.hora)
        this.igv = data.igv
        this.items = data.items.map(item => new ItemModel(item))
        this.inafecta = data.inafecta
        this.modifica = data.modifica
        this.moneda = data.moneda ? new MonedaModel(data.moneda) : null
        this.numero = data.numero
        this.observacion = data.observacion
        this.pagado = data.pagado
        this.saldo = data.saldo
        this.sended = data.sended
        this.serie = data.serie
        this.ser_num = data.ser_num
        this.total = data.total
        this.usuario = data.usuario
        console.log(this.hora)
    }
    get monedaSingular (): string {
        return this.moneda.id === 1 ? 'SOL' : 'DÓLAR'
    }
    get monedaPlural (): string {
        return this.moneda.id === 1 ? 'SOLES' : 'DÓLARES'
    }
    get monedaTextos (): { plural: string; singular: string } {
        return { plural: this.monedaPlural, singular: this.monedaSingular }
    }
    getFooter (user: UserModel, reimprimir: boolean): string {
        let footer = `H.PROC: ${this.hora.toFormat(
            'yyyy-MM-dd HH:mm:ss'
        )} ID: ${this.id} ${this.caja.usuario.nombre.toUpperCase()}`
        if (this.anulado) {
            footer += `
            ****** ANULADO ******
            H.IMP: ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`
        }
        if (reimprimir) {
            footer += `
            ****** REIMPRESIÓN ******
            H.IMP: ${DateTime.now().toFormat(
                'yyyy-MM-dd HH:mm:ss'
            )} ${user.username.toUpperCase()}`
        }
        footer += `
              Sistema de Gestion TCONTUR`
        return footer
    }
}

export class AbonoModel {
    id: number
    abono: number
    anulado: boolean
    caja: number
    cliente: number
    detalle: string
    dia: Date
    hora: Date
    moneda: number
    usuario: number

    constructor (data: IAbono) {
        this.id = data.id
        this.abono = data.abono
        this.anulado = data.anulado
        this.caja = data.caja
        this.cliente = data.cliente
        this.detalle = data.detalle
        this.dia = data.dia
        this.hora = data.hora
        this.moneda = data.moneda
        this.usuario = data.usuario
    }
}

export class CajaModel {
    id: number
    contometro_final: null
    contometro_inicial: number
    fin: Date
    inicio: Date
    lado: boolean
    saldo_inicial: number
    sede: SedeModel
    transferencia: null
    usuario: UserModel

    constructor (data: ICaja) {
        this.id = data.id
        this.contometro_final = data.contometro_final
        this.contometro_inicial = data.contometro_inicial
        this.fin = data.fin
        this.inicio = data.inicio
        this.lado = data.lado
        this.saldo_inicial = data.saldo_inicial
        this.sede = data.sede ? new SedeModel(data.sede) : null
        this.transferencia = data.transferencia
        this.usuario = data.usuario ? new UserModel(data.usuario) : null
    }
}

export class SedeModel {
    id: number
    almacen: AlmacenModel
    nombre: string
    activo: boolean

    constructor (data: ISede) {
        this.id = data.id
        this.almacen = data.almacen ? new AlmacenModel(data.almacen) : null
        this.nombre = data.nombre
        this.activo = data.activo
    }
}

export class AlmacenModel {
    id: number
    name: string

    constructor (data: IAlmacen) {
        this.id = data.id
        this.name = data.name
    }
}

export class UserModel {
    id: number
    cargo: string
    nombre: string
    username: string

    constructor (data: IUser) {
        this.id = data.id
        this.cargo = data.cargo
        this.nombre = data.nombre
        this.username = data.username
    }
}

export class ClienteModel {
    id: number
    activo: boolean
    cliente_id: number
    codigo: string
    direccion: string
    display_tipo: string
    distrito: string
    dni: string
    email: null | string
    nombre: string
    padron: string
    persona: string
    placa: string
    razon: string
    referencia: string
    referencia_compuesta: string
    ruc: number
    telefono: null | string
    tipo: string

    constructor (data: ICliente) {
        this.id = data.id
        this.activo = data.activo
        this.cliente_id = data.cliente_id
        this.codigo = data.codigo
        this.direccion = data.direccion
        this.display_tipo = data.display_tipo
        this.distrito = data.distrito
        this.dni = data.dni
        this.email = data.email
        this.nombre = data.nombre
        this.padron = data.padron
        this.persona = data.persona
        this.placa = data.placa
        this.razon = data.razon
        this.referencia = data.referencia
        this.referencia_compuesta = data.referencia_compuesta
        this.ruc = data.ruc
        this.telefono = data.telefono
        this.tipo = data.tipo
    }
}

export class DeudaModel {
    id: number
    dia: string
    nombre: Nombre
    inicial: number
    saldo: number

    constructor (data: IDeuda) {
        this.id = data.id
        this.dia = data.dia
        this.nombre = data.nombre
        this.inicial = data.inicial
        this.saldo = data.saldo
    }
}

export enum Nombre {
    AMedioUniversitarioS170 = 'A-MEDIO/UNIVERSITARIO S/1.70',
    AdministracionSDF = 'ADMINISTRACION S-D-F-',
    Boletaje = 'BOLETAJE',
    FondoDeManten = 'FONDO DE MANTEN',
    FondoPapeleta = 'FONDO PAPELETA',
    LimpBus = 'LIMP BUS',
    LimpDesinf = 'LIMP DESINF',
    Nuevo = 'NUEVO',
    ServicioPorRastreoSatelitalGpsFrecuencia = 'SERVICIO POR RASTREO SATELITAL GPS FRECUENCIA',
    Testst = 'TESTST',
    Tteat = 'TTEAT'
}

export class DocumentoModel {
    id: number
    activo: boolean
    es_egreso: boolean
    nombre: string
    numero: number
    sede: SedeModel
    serie: string
    sunat: SunatModel

    constructor (data: IDocumento) {
        this.id = data.id
        this.activo = data.activo
        this.es_egreso = data.es_egreso
        this.nombre = data.nombre
        this.numero = data.numero
        this.sede = data.sede ? new SedeModel(data.sede) : null
        this.serie = data.serie
        this.sunat = data.sunat ? new SunatModel(data.sunat) : null
    }
}

export class SunatModel {
    id: number
    codigo: number
    nombre: string
    es_compra: boolean

    constructor (data: ISunat) {
        this.id = data.id
        this.codigo = data.codigo
        this.nombre = data.nombre
        this.es_compra = data.es_compra
    }
}

export class ItemModel {
    id: number
    base: number
    cantidad: number
    deuda: DeudaModel
    efectivo: boolean
    igv: number
    inafecta: number
    moneda: number
    observacion: string
    pagado: number
    precio: number
    precio_unit: number
    producto: ProductoModel
    recibo: ReciboModel
    saldo: number
    usuario: UserModel

    constructor (data: IItem) {
        this.id = data.id
        this.base = data.base
        this.cantidad = data.cantidad
        this.deuda = data.deuda ? new DeudaModel(data.deuda) : null
        this.efectivo = data.efectivo
        this.igv = data.igv
        this.inafecta = data.inafecta
        this.moneda = data.moneda
        this.observacion = data.observacion
        this.pagado = data.pagado
        this.precio = data.precio
        this.precio_unit = data.precio_unit
        this.producto = data.producto ? new ProductoModel(data.producto) : null
        this.recibo = data.recibo ? new ReciboModel(data.recibo) : null
        this.saldo = data.saldo
        this.usuario = data.usuario ? new UserModel(data.usuario) : null
    }

    get stringRecibo () {
        return this.producto
            ? this.cantidad +
                  ' ' +
                  this.producto?.nombre +
                  ' ' +
                  (this.deuda?.dia || '')
            : ''
    }
}

export class ProductoModel {
    id: number
    activo: boolean
    automatico: boolean
    cliente: string
    codigo: string
    combustible: boolean
    es_gasto: boolean
    fondo: boolean
    fracciones: boolean
    igv: boolean
    isc: number
    moneda: number
    nombre: string
    precio: number
    servicio: boolean
    stock: number
    variable: boolean

    constructor (data: IProducto) {
        this.id = data.id
        this.activo = data.activo
        this.automatico = data.automatico
        this.cliente = data.cliente
        this.codigo = data.codigo
        this.combustible = data.combustible
        this.es_gasto = data.es_gasto
        this.fondo = data.fondo
        this.fracciones = data.fracciones
        this.igv = data.igv
        this.isc = data.isc
        this.moneda = data.moneda
        this.nombre = data.nombre
        this.precio = data.precio
        this.servicio = data.servicio
        this.stock = data.stock
        this.variable = data.variable
    }
}

export class ReciboModel {
    id: number
    anulado: boolean
    dia: Date
    documento: number
    efectivo: boolean
    hora: Date
    moneda: number
    numero: string
    pagado: boolean
    saldo: number
    sended: boolean
    serie: string
    total: number
    usuario: number

    constructor (data: IRecibo) {
        this.id = data.id
        this.anulado = data.anulado
        this.dia = data.dia
        this.documento = data.documento
        this.efectivo = data.efectivo
        this.hora = data.hora
        this.moneda = data.moneda
        this.numero = data.numero
        this.pagado = data.pagado
        this.saldo = data.saldo
        this.sended = data.sended
        this.serie = data.serie
        this.total = data.total
        this.usuario = data.usuario
    }
}

export class MonedaModel {
    id: number
    nombre: string
    codigo: string

    constructor (data: IMoneda) {
        this.id = data.id
        this.nombre = data.nombre
        this.codigo = data.codigo
    }
}

export class ConductorModel {
    id: number
    activo: boolean
    castigado: boolean
    boletos_save: boolean
    codigo: string
    conductor: boolean
    dni: string
    estado: string
    nombre: string
    vencido: boolean
    vigente: boolean
    vencimiento: Date

    constructor (data: IConductor) {
        this.id = data.id
        this.activo = data.activo
        this.castigado = data.castigado
        this.boletos_save = data.boletos_save
        this.codigo = data.codigo
        this.conductor = data.conductor
        this.dni = data.dni
        this.estado = data.estado
        this.nombre = data.nombre
        this.vencido = data.vencido
        this.vigente = data.vigente
        this.vencimiento = data.vencimiento
    }
}
