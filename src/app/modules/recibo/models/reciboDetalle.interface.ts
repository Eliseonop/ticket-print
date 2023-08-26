export interface IReciboDetalle {
    id: number
    abono: IAbono
    anulado: boolean
    base: number
    caja: ICaja
    cliente: ICliente
    conductor: IConductor
    dia: string
    deuda: null
    deudas: IDeuda[]
    documento: IDocumento
    efectivo: boolean
    fondos: any[]
    hora: string
    igv: number
    items: IItem[]
    inafecta: number
    modifica: null
    moneda: IMoneda
    numero: string
    observacion: null
    pagado: boolean
    saldo: number
    sended: boolean
    serie: string
    ser_num: string
    total: number
    usuario: number
}

export interface IAbono {
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
}

export interface ICaja {
    id: number
    contometro_final: null
    contometro_inicial: number
    fin: Date
    inicio: Date
    lado: boolean
    saldo_inicial: number
    sede: ISede
    transferencia: null
    usuario: IUser
}

export interface ISede {
    id: number
    almacen: IAlmacen
    nombre: string
    activo: boolean
}

export interface IAlmacen {
    id: number
    name: string
}

export interface IUser {
    id: number
    cargo: string
    nombre: string
    username: string
}

export interface ICliente {
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
}

export interface IDeuda {
    id: number
    dia: string
    nombre: Nombre
    inicial: number
    saldo: number
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

export interface IDocumento {
    id: number
    activo: boolean
    es_egreso: boolean
    nombre: string
    numero: number
    sede: ISede
    serie: string
    sunat: ISunat
}

export interface ISunat {
    id: number
    codigo: number
    nombre: string
    es_compra: boolean
}

export interface IItem {
    id: number
    base: number
    cantidad: number
    deuda: IDeuda
    efectivo: boolean
    igv: number
    inafecta: number
    moneda: number
    observacion: string
    pagado: number
    precio: number
    precio_unit: number
    producto: IProducto
    recibo: IRecibo
    saldo: number
    usuario: IUser
}

export interface IProducto {
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
}

export interface IRecibo {
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
}

export interface IMoneda {
    id: number
    nombre: string
    codigo: string
}
export interface IConductor {
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
}
