import { DateTime } from 'luxon'

import {
    BoletajeSuministroInterface,
    ControleEstado,
    IAval,
    IBoletaje,
    IBoleto,
    ICobrador,
    IConfiguracion,
    IPadron,
    IRuta,
    ISalida,
    ISuministro,
    IUnidad,
    RutaSelectInterface,
    SalidaCompletaFormatInterface,
    SalidaCompletaResponseInterface,
    SalidaDespachoResponseInterface,
    SuministroEstado
} from './salida.interface'
import { ControlModel } from './control.model'

export class SalidaCompletaModel {
    anterior: number
    boletaje: BoletajeModel[]
    boletosSave: boolean
    cobrador?: TrabajadorSelectModel
    conductor?: TrabajadorSelectModel
    controles?: ControlModel[]
    creado: DateTime
    dia: DateTime
    estado: string
    fin: DateTime
    frecuencia: number
    id: number
    ingreso: DateTime
    inicio: DateTime
    inspecciones: InspeccionModel[]
    lado: boolean
    liquidacion: number
    multa: number
    multaCreada: boolean
    padron: number
    pasajerosBoletos: number
    pasajerosTickets: number
    placa: string
    produccion: number
    produccionBoletos: number
    produccionDiferencia: number
    produccionTickets: number
    produccionTransbordo: number
    record: number
    ruta: RutaSelectInterface
    siguiente: number
    ticketsSave: boolean
    unidad: UnidadCompletaModel
    vuelta: number
    //getters
    vueltaStr: string
    ladoStr: string
    rutaStr: string
    inicioShort: string
    finShort: string
    diaStr: string
    conductorNombre: string
    cobradorNombre: string
    conductorCodigo: string
    cobradorCodigo: string
    produccionStr: string
    salidaStr: string
    warn: boolean

    constructor (salida: SalidaCompletaResponseInterface) {
        this.anterior = salida.anterior
        if (salida.boletaje) {
            this.boletaje = salida.boletaje.map(b => new BoletajeModel(b))
        }
        this.boletosSave = salida.boletos_save
        this.cobrador = new TrabajadorSelectModel(salida.cobrador)
        this.conductor = new TrabajadorSelectModel(salida.conductor)
        if (salida?.controles?.length > 0) {
            this.controles = salida.controles.map(c => new ControlModel(c))
        } else {
            this.controles = []
        }
        this.creado = DateTime.fromISO(salida.creado)
        this.dia = DateTime.fromSQL(salida.dia)
        this.estado = salida.estado
        this.fin = DateTime.fromISO(salida.fin)
        this.frecuencia = salida.frecuencia
        this.id = salida.id
        this.ingreso = DateTime.fromISO(salida.ingreso)
        this.inicio = DateTime.fromISO(salida.inicio)
        // this.inicio = DateTime.fromSQL(salida.inicio);
        if (salida?.inspecciones?.length > 0) {
            this.inspecciones = salida.inspecciones.map(
                c => new InspeccionModel(c)
            )
        } else {
            this.inspecciones = []
        }
        this.lado = salida.lado
        this.liquidacion = salida.liquidacion
        this.multa = salida.multa
        this.multaCreada = salida.multa_creada
        this.padron = salida.padron
        this.pasajerosBoletos = salida.pasajerosBoletos
        this.pasajerosTickets = salida.pasajerosTickets
        this.placa = salida.placa
        this.produccion = salida.produccion
        this.produccionBoletos = salida.produccionBoletos
        this.produccionDiferencia = salida.produccionDiferencia
        this.produccionTickets = salida.produccionTickets
        this.produccionTransbordo = salida.produccionTransbordo
        this.record = salida.record
        this.ruta = salida.ruta
        this.siguiente = salida.siguiente
        this.ticketsSave = salida.tickets_save
        this.unidad = new UnidadCompletaModel(salida.unidad)
        this.vuelta = salida.vuelta
        // getters
        this.vueltaStr = (this.vuelta / 2).toString()
        this.ladoStr = this.lado ? 'B' : 'A'
        this.rutaStr = this.ruta?.codigo
        this.inicioShort = this.inicio.toFormat('HH:mm')
        this.finShort = this.fin.isValid ? this.fin.toFormat('HH:mm') : '--:--'
        this.diaStr = this.dia.toFormat('yy-MM-dd')
        this.conductorNombre = this.conductor?.nombre || 'TEMPORAL'
        this.cobradorNombre = this.cobrador?.nombre || 'TEMPORAL'
        this.conductorCodigo = this.conductor?.codigo || ''
        this.cobradorCodigo = this.cobrador?.codigo || ''
        this.produccionStr = `${(this.produccion / 100).toFixed(2)}`
        this.salidaStr = `${this.padron} - ${this.inicioShort} ${this.ladoStr} - ${this.diaStr}`
        this.warn = this.estado === 'F'
    }

    static fromSocket (data: SalidaCompletaResponseInterface) {
        return new SalidaCompletaModel(data)
    }

    toResponse (): any {
        const salida = {
            id: this.id,
            anterior: this.anterior,
            boletaje: this.boletaje,
            boletos_save: this.boletosSave,
            cobrador: this.cobrador,
            conductor: this.conductor,
            creado: this.creado.toSQL(),
            dia: this.dia.toSQLDate(),
            estado: this.estado,
            fin: this.fin.toSQLTime(),
            frecuencia: this.frecuencia,
            ingreso: this.ingreso.toISO(),
            inicio: this.inicio.toISO(),
            inspecciones: this.inspecciones.map(i => i),
            lado: this.lado,
            liquidacion: this.liquidacion,
            multa: this.multa,
            multa_creada: this.multaCreada,
            padron: this.padron,
            pasajerosBoletos: this.pasajerosBoletos,
            pasajerosTickets: this.pasajerosTickets,
            placa: this.placa,
            produccion: this.produccion,
            produccionBoletos: this.produccionBoletos,
            produccionDiferencia: this.produccionDiferencia,
            produccionTickets: this.produccionTickets,
            produccionTransbordo: this.produccionTransbordo,
            record: this.record,
            ruta: this.ruta,
            siguiente: this.siguiente,
            tickets_save: this.ticketsSave,
            unidad: this.unidad,
            vuelta: this.vuelta
        }
        if (this.controles?.length > 0) {
            salida['controles'] = this.controles.map(c => c.toResponse())
        }

        return salida
    }

    getConductorName (imprimirNombre: ConfiguracionesModel): string {
        if (imprimirNombre && imprimirNombre.data === 'false') {
            return this.conductor?.id ? this.conductor.codigo : 'TEMPORAL'
        } else {
            return this.conductor?.id
                ? this.conductor.nombre.slice(0, 32)
                : 'TEMPORAL'
        }
    }

    getCobradorName (imprimirNombre: ConfiguracionesModel): string {
        if (imprimirNombre && imprimirNombre.data === 'false') {
            return this.cobrador?.id ? this.cobrador.codigo : 'TEMPORAL'
        } else {
            return this.cobrador?.id
                ? this.cobrador.nombre.slice(0, 32)
                : 'TEMPORAL'
        }
    }

    toFormat (index: number): SalidaCompletaFormatInterface {
        return {
            id: this.id,
            cobrador: this.cobrador?.nombre || 'TEMPORAL',
            codigoCobrador: this.cobrador?.codigo,
            conductor: this.conductor?.nombre || 'TEMPORAL',
            codigoConductor: this.conductor?.codigo,
            dia: this.dia.toSQLDate(),
            estado: this.estado,
            fin: this.fin ? this.fin.toSQLTime() : '--:--',
            frecuencia: this.frecuencia,
            index: index + 1,
            inicio: this.inicio.toSQLTime(),
            lado: this.ladoStr,
            multa: this.multa,
            padron: this.padron,
            placa: this.placa,
            produccion: `${Number(this.produccion / 100).toFixed(2)}`,
            record: this.record,
            ruta: this.ruta?.codigo,
            salida: this.inicio,
            unidad: this.unidad.toUnidadResponse(),
            vuelta: this.vuelta * 0.5,
            warn: this.estado === 'F'
        }
    }

    toDespacho (): SalidaDespachoResponseInterface {
        return {
            anterior: this.anterior,
            backup: null,
            boletos_save: this.boletosSave,
            cobrador: this.cobrador,
            conductor: this.conductor,
            creado: this.creado.toSQL(),
            dia: this.dia.toSQLDate(),
            estado: this.estado,
            fin: this.fin.toSQL(),
            frecuencia: this.frecuencia,
            id: this.id,
            ingreso: this.ingreso.toSQL(),
            inicio: this.inicio.toSQL(),
            lado: this.lado,
            liquidacion: this.liquidacion,
            padron: this.padron,
            pasajeros: this.pasajerosTickets + this.pasajerosBoletos,
            pasajerosBoletos: this.pasajerosBoletos,
            pasajerosTickets: this.pasajerosTickets,
            placa: this.placa,
            produccion: this.produccion,
            produccionBoletos: this.produccionBoletos,
            produccionDiferencia: this.produccionDiferencia,
            produccionTickets: this.produccionTickets,
            produccionTransbordo: this.produccionTransbordo,
            record: this.record,
            ruta: this.ruta,
            siguiente: this.siguiente,
            tickets_save: this.ticketsSave,
            unidad: this.unidad.toUnidadResponse(),
            vuelta: this.vuelta
        }
    }
}

export class ConfiguracionesModel {
    id: number
    data: string
    nombre: string
    constructor (data: IConfiguracion) {
        this.id = data.id
        this.data = data.data
        this.nombre = data.nombre
    }
}

export class BoletajeModel {
    id: number
    anulado: boolean
    boleto: number
    fin: number
    final: number
    inicio: number
    orden: number
    precio: number
    produccion: number
    salida: number
    serie: string
    suministro: number
    constructor (data: IBoletaje) {
        this.id = data.id
        this.anulado = data.anulado
        this.boleto = data.boleto
        this.fin = data.fin
        this.final = data.final
        this.inicio = data.inicio
        this.orden = data.orden
        this.precio = data.precio
        this.produccion = data.produccion
        this.salida = data.salida
        this.serie = data.serie
        this.suministro = data.suministro
    }
    toBoletajeSuministroFormat (boleto: BoletoModel): BoletajeSuministroModel {
        return new BoletajeSuministroModel({
            alerta: boleto.alerta,
            anulado: this.anulado,
            boletajeId: this.id,
            boleto: boleto.nombre,
            boletoId: boleto.id,
            estado: '',
            fin: this.fin,
            inicio: this.inicio,
            orden: boleto.orden,
            serie: this.serie,
            suministroId: this.suministro,
            tarifa: boleto.tarifa
        })
    }
}

export class BoletajeSuministroModel {
    alerta: number
    anulado: boolean
    boletajeId: number
    boleto: string
    boletoId: number
    estado: string
    fin: number
    inicio: number
    orden: number
    serie: string
    suministroId: number
    tarifa: number
    constructor (data: BoletajeSuministroInterface) {
        this.alerta = data.alerta
        this.anulado = data.anulado
        this.boletajeId = data.boletajeId
        this.boleto = data.boleto
        this.boletoId = data.boletoId
        this.estado = data.estado
        this.fin = data.fin
        this.inicio = data.inicio
        this.orden = data.orden
        this.serie = data.serie
        this.suministroId = data.suministroId
        this.tarifa = data.tarifa
    }
}

export class BoletoModel {
    id: number
    alerta: number
    minimo: number
    nombre: string
    opcional: number
    orden: number
    reintegro: boolean
    ruta: number
    tarifa: number

    constructor (data: IBoleto) {
        this.id = data.id
        this.alerta = data.alerta
        this.minimo = data.minimo
        this.nombre = data.nombre
        this.opcional = data.opcional
        this.orden = data.orden
        this.reintegro = data.reintegro
        this.ruta = data.ruta
        this.tarifa = data.tarifa
    }
}

export class SalidaModel {
    anterior: number
    boletos_save: boolean
    cobrador: number
    conductor: number
    creado: string
    dia: string
    estado: string
    fin: string
    frecuencia: number
    id: number
    ingreso: string
    inicio: string
    lado: boolean
    liquidacion: number
    multa: number
    multa_creada: boolean
    padron: number
    pasajerosBoletos: number
    pasajerosTickets: number
    placa: string
    produccion: number
    produccionBoletos: number
    produccionDiferencia: number
    produccionTickets: number
    produccionTransbordo: number
    record: number
    ruta: number
    tickets_save: boolean
    unidad: number
    vuelta: number

    constructor (data: ISalida) {
        this.id = data.id
        this.anterior = data.anterior
        this.boletos_save = data.boletos_save
        this.cobrador = data.cobrador
        this.conductor = data.conductor
        this.creado = data.creado
        this.dia = data.dia
        this.estado = data.estado
        this.fin = data.fin
        this.frecuencia = data.frecuencia
        this.ingreso = data.ingreso
        this.inicio = data.inicio
        this.lado = data.lado
        this.liquidacion = data.liquidacion
        this.multa = data.multa
        this.multa_creada = data.multa_creada
        this.padron = data.padron
        // this.pasajeros = data.pasajeros
        this.pasajerosBoletos = data.pasajerosBoletos
        this.pasajerosTickets = data.pasajerosTickets
        this.placa = data.placa
        this.produccion = data.produccion
        this.produccionBoletos = data.produccionBoletos
        this.produccionDiferencia = data.produccionDiferencia
        this.produccionTickets = data.produccionTickets
        this.produccionTransbordo = data.produccionTransbordo
        this.record = data.record
        // this.ruta = data.ruta
        // this.siguiente = data.siguiente
        this.tickets_save = data.tickets_save
        // this.unidad = data.unidad
        this.vuelta = data.vuelta
        // this.boletaje = data.boletaje
        // this.controles = data.controles
        // this.inspecciones = data.inspecciones
        // this.tickets = data.tickets
    }
}

export class InspeccionModel {
    id: number
    estado: string
    fecha: DateTime
    salida: number
    unidad: number
    constructor (data: any) {
        this.id = data.id
        this.estado = data.estado
        this.fecha = DateTime.fromISO(data.fecha)
        this.salida = data.salida
        this.unidad = data.unidad
    }
}

export class UnidadCompletaModel {
    id: number
    activo: boolean
    actual: number
    arreglada: number
    aval: IAval
    baja: null
    bloqueado: boolean
    bloqueadoA: boolean
    bloqueadoB: boolean
    boletosSave: boolean
    cobrador: ICobrador
    cola: boolean
    conductor: ICobrador
    estado: string
    estadoDetail: string
    finViaje: Date
    ingreso: null
    ingresoEspera: Date
    lado: boolean
    logueado: null
    monitoreo: IAval
    observacion: string
    odometro: number
    orden: number
    padron: IPadron
    placa: string
    prioridad: string
    propietario: IAval
    record: number
    ruta: IRuta
    vencido: boolean
    vigente: boolean
    vencimiento: Date
    alto: number
    ancho: number
    largo: number
    peso: number
    carga: number
    asientos: number
    pasajeros: number
    fabricacion: number
    carroceria: string
    color: string
    modelo: string
    marca: string
    clase: string
    cilindros: number
    motor: string
    numser: string
    modalidad: string
    poliza: string
    tarjeta: string
    prioridadDetail: string
    suministros: ISuministro[]

    constructor (data: IUnidad) {
        // generate all    //
        this.id = data.id
        this.activo = data.activo
        this.actual = data.actual
        this.arreglada = data.arreglada
        this.aval = data.aval
        this.baja = data.baja
        this.bloqueado = data.bloqueado
        this.bloqueadoA = data.bloqueado_a
        this.bloqueadoB = data.bloqueado_b
        this.boletosSave = data.boletos_save
        this.cobrador = data.cobrador
        this.cola = data.cola
        this.conductor = data.conductor
        this.estado = data.estado
        this.estadoDetail = data.estadoDetail
        this.finViaje = data.fin_viaje
        this.ingreso = data.ingreso
        this.ingresoEspera = data.ingreso_espera
        this.lado = data.lado
        this.logueado = data.logueado
        this.monitoreo = data.monitoreo
        this.observacion = data.observacion
        this.odometro = data.odometro
        this.orden = data.orden
        this.padron = data.padron
        this.placa = data.placa
        this.prioridad = data.prioridad
        this.propietario = data.propietario
        this.record = data.record
        this.ruta = data.ruta
        this.vencido = data.vencido
        this.vigente = data.vigente
        this.vencimiento = data.vencimiento
        this.alto = data.alto
        this.ancho = data.ancho
        this.largo = data.largo
        this.peso = data.peso
        this.carga = data.carga
        this.asientos = data.asientos
        this.pasajeros = data.pasajeros
        this.fabricacion = data.fabricacion
        this.carroceria = data.carroceria
        this.color = data.color
        this.modelo = data.modelo
        this.marca = data.marca
        this.clase = data.clase
        this.cilindros = data.cilindros
        this.motor = data.motor
        this.numser = data.numser
        this.modalidad = data.modalidad
        this.poliza = data.poliza
        this.tarjeta = data.tarjeta
        this.prioridadDetail = data.prioridadDetail
        this.suministros = data.suministros
    }

    toUnidadResponse (): any {
        return {
            id: this.id,
            activo: this.activo,
            actual: this.actual,
            arreglada: this.arreglada,
            aval: this.aval,
            baja: this.baja,
            bloqueado: this.bloqueado,
            bloqueado_a: this.bloqueadoA,
            bloqueado_b: this.bloqueadoB,
            boletos_save: this.boletosSave,
            cobrador: this.cobrador,
            cola: this.cola,
            conductor: this.conductor,
            estado: this.estado,
            estadoDetail: this.estadoDetail,
            fin_viaje: this.finViaje,
            ingreso: this.ingreso,
            ingreso_espera: this.ingresoEspera,
            lado: this.lado,
            logueado: this.logueado,
            monitoreo: this.monitoreo,
            observacion: this.observacion,
            odometro: this.odometro,
            orden: this.orden,
            padron: this.padron,
            placa: this.placa,
            prioridad: this.prioridad,
            propietario: this.propietario,
            record: this.record,
            ruta: this.ruta,
            vencido: this.vencido,
            vigente: this.vigente,
            vencimiento: this.vencimiento,
            alto: this.alto,
            ancho: this.ancho,
            largo: this.largo
        }
    }

    toSelectResponse (): any {
        return {
            id: this.id,
            placa: this.placa,
            padron: this.padron,
            lado: this.lado,
            ruta: this.ruta
        }
    }
}

export class CobradorModel {
    id: number
    activo: boolean
    castigado: boolean
    codigo: string
    conductor: boolean
    dni: string
    estado: string
    nombre: string
    vencido: boolean
    vigente: boolean
    vencimiento: Date

    constructor (data: ICobrador) {
        this.id = data.id
        this.activo = data.activo
        this.castigado = data.castigado
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

export class RutaModel {
    id: number
    codigo: string
    plantilla_actual: number

    constructor (data: IRuta) {
        this.id = data.id
        this.codigo = data.codigo
        this.plantilla_actual = data.plantilla_actual
    }
}

export class UnidadModel {
    id: number
    activo: boolean
    actual: number
    arreglada: number
    aval: IAval
    baja: null
    bloqueado: boolean
    bloqueado_a: boolean
    bloqueado_b: boolean
    boletos_save: boolean
    cobrador: ICobrador
    cola: boolean
    conductor: ICobrador
    estado: string
    estadoDetail: string
    fin_viaje: Date
    ingreso: null
    ingreso_espera: Date
    lado: boolean
    logueado: null
    monitoreo: IAval
    observacion: string
    odometro: number
    orden: number
    padron: IPadron
    placa: string
    prioridad: string
    propietario: IAval
    record: number
    ruta: IRuta
    vencido: boolean
    vigente: boolean
    vencimiento: Date
    alto: number
    ancho: number
    largo: number
    peso: number
    carga: number
    asientos: number
    pasajeros: number
    fabricacion: number
    carroceria: string
    color: string
    modelo: string
    marca: string
    clase: string
    cilindros: number
    motor: string
    numser: string
    modalidad: string
    poliza: string
    tarjeta: string
    prioridadDetail: string
    suministros: ISuministro[]

    constructor (data: IUnidad) {
        this.id = data.id
        this.activo = data.activo
        this.actual = data.actual
        this.arreglada = data.arreglada
        this.aval = data.aval
        this.baja = data.baja
        this.bloqueado = data.bloqueado
        this.bloqueado_a = data.bloqueado_a
        this.bloqueado_b = data.bloqueado_b
        this.boletos_save = data.boletos_save
        this.cobrador = data.cobrador
        this.cola = data.cola
        this.conductor = data.conductor
        this.estado = data.estado
        this.estadoDetail = data.estadoDetail
        this.fin_viaje = data.fin_viaje
        this.ingreso = data.ingreso
        this.ingreso_espera = data.ingreso_espera
        this.lado = data.lado
        this.logueado = data.logueado
        this.monitoreo = data.monitoreo
        this.observacion = data.observacion
        this.odometro = data.odometro
        this.orden = data.orden
        this.padron = data.padron
        this.placa = data.placa
        this.prioridad = data.prioridad
        this.propietario = data.propietario
        this.record = data.record
        this.ruta = data.ruta
        this.vencido = data.vencido
        this.vigente = data.vigente
        this.vencimiento = data.vencimiento
        this.alto = data.alto
        this.ancho = data.ancho
        this.largo = data.largo
        this.peso = data.peso
        this.carga = data.carga
        this.asientos = data.asientos
        this.pasajeros = data.pasajeros
        this.fabricacion = data.fabricacion
        this.carroceria = data.carroceria
        this.color = data.color
        this.modelo = data.modelo
        this.marca = data.marca
        this.clase = data.clase
        this.cilindros = data.cilindros
        this.motor = data.motor
        this.numser = data.numser
        this.modalidad = data.modalidad
        this.poliza = data.poliza
        this.tarjeta = data.tarjeta
        this.prioridadDetail = data.prioridadDetail
        this.suministros = data.suministros
    }
}

export class AvalModel {
    id: number
    cargo: string
    nombre: string
    username: string

    constructor (data: IAval) {
        this.id = data.id
        this.cargo = data.cargo
        this.nombre = data.nombre
        this.username = data.username
    }
}

export class PadronModel {
    id: number
    activo: boolean
    paquete: null
    propietario: number
}

export class SuministroModel {
    id: number
    actual: number
    boleto: IBoleto
    cantidad: number
    estado: SuministroEstado
    fin: number
    hora: Date
    inicio: number
    serie: string
    stock: number
    terminado: boolean
    usuario: IAval

    constructor (data: ISuministro) {
        this.id = data.id
        this.actual = data.actual
        this.boleto = data.boleto
        this.cantidad = data.cantidad
        this.estado = data.estado
        this.fin = data.fin
        this.hora = data.hora
        this.inicio = data.inicio
        this.serie = data.serie
        this.stock = data.stock
        this.terminado = data.terminado
        this.usuario = data.usuario
    }
}

export class TrabajadorSelectModel {
    id: number
    codigo: string
    nombre: string
    constructor (data: ICobrador) {
        this.id = data.id
        this.codigo = data.codigo
        this.nombre = data.nombre
    }
}
