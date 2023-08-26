import { DateTime } from 'luxon'
import { InspeccionModel, TrabajadorSelectModel } from './salida.model'
import { ControlResponseInterface } from './control.model'

export interface ISalida {
    id: number
    anterior: number
    boletos_save: boolean
    cobrador: number
    conductor: number
    creado: string
    dia: string
    estado: string
    fin: string
    frecuencia: number
    ingreso: string
    inicio: string
    lado: boolean
    liquidacion: number
    multa: number
    multa_creada: boolean
    padron: number
    pasajeros: number
    pasajerosBoletos: number
    pasajerosTickets: number
    placa: string
    produccion: number
    produccionBoletos: number
    produccionDiferencia: number
    produccionTickets: number
    produccionTransbordo: number
    record: number
    ruta: IRuta
    siguiente: null
    tickets_save: boolean
    unidad: any
    vuelta: number
    boletaje: IBoletaje[]
    controles: ControlResponseInterface[]
    inspecciones: any[]
    tickets: any[]
}

export interface ICobrador {
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

export enum ControleEstado {
    S = 'S'
}

export interface IRuta {
    id: number
    codigo: string
    plantilla_actual: number
}

export interface IUnidad {
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
}

export interface IAval {
    id: number
    cargo: string
    nombre: string
    username: string
}

export interface IPadron {
    id: number
    activo: boolean
    paquete: null
    propietario: number
}

export interface ISuministro {
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
}

export interface IBoleto {
    id: number
    alerta: number
    minimo: number
    nombre: string
    opcional: number
    orden: number
    reintegro: boolean
    ruta: number
    tarifa: number
}

export enum SuministroEstado {
    EnUso = 'En Uso',
    Reserva = 'Reserva'
}

export interface IBoletaje {
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
}

export interface BoletajeSuministroInterface {
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
}

export interface SalidaDespachoResponseInterface {
    anterior: number
    backup: boolean
    boletos_save: boolean
    cobrador: TrabajadorSelectModel
    conductor: TrabajadorSelectModel
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
    padron: number
    pasajeros: number
    pasajerosBoletos: number
    pasajerosTickets: number
    placa: string
    produccion: number
    produccionBoletos: number
    produccionDiferencia: number
    produccionTickets: number
    produccionTransbordo: number
    record: number
    ruta: IRuta
    siguiente: number
    tickets_save: boolean
    unidad: IUnidad
    vuelta: number
}

export interface SalidaCompletaFormatInterface {
    id: number
    cobrador: string
    conductor: string
    codigoCobrador: string
    codigoConductor: string
    dia: string
    estado: string
    fin: string
    frecuencia: number
    index: number
    inicio: string
    lado: string
    multa: number
    padron: number
    placa: string
    produccion: string
    record: number
    ruta: string
    salida: DateTime
    unidad: string
    vuelta: number
    warn: boolean
}

export interface IConfiguracion {
    id: number
    data: string
    nombre: string
}

export interface RutaSelectInterface {
    id: number
    codigo: string
    plantilla_actual: number
    nombre: string
    plantilla: IPlantilla
}

export interface IPlantilla {
    id: number
    codigo: string
    nombre: string
    ruta: number
    plantilla: number
    orden: number
    paradas: any
}

export interface SalidaCompletaResponseInterface {
    anterior: number
    boletaje: IBoletaje[]
    boletos_save: boolean
    cobrador?: ICobrador
    conductor?: ICobrador
    controles?: ControlResponseInterface[]
    creado: string
    dia: string
    estado: string
    fin: string
    frecuencia: number
    id: number
    ingreso: string
    inicio: string
    inspecciones: InspeccionModel[]
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
    ruta: RutaSelectInterface
    siguiente: number
    tickets_save: boolean
    unidad: IUnidad
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
}
