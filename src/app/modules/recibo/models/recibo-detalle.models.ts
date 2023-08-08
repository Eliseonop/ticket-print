// // import { ReciboModel } from './recibo.model'
// // import { ReciboDetalleResponseInterface } from './recibo-detalle-response.interface'
// // import { AbonoResponseInterface } from './abono-response.interface'
// // import { AbonoSelectModel } from './abono-select.model'
// // import { DeudaSelectModel } from './deuda-select.model'
// // import { DeudaSaldoInterface } from './deuda-saldo.interface'
// // import { ReciboSelectResponseInterface } from './recibo-select-response.interface'
// // import { ConfiguracionesModel } from 'app/modules/configuraciones/configuraciones-empresa/models/configuraciones.model'
// // import { DocumentoModel } from 'app/modules/tesoreria/documentos/models/documento.model'
// // import { TrabajadorSelectInterface } from 'app/modules/configuraciones/trabajadores/models/trabajador-select.interface'
// // import { CajaModel } from 'app/modules/tesoreria/recaudo/caja/models/caja.model'
// // import { FondoInterface } from 'app/modules/tesoreria/recaudo/caja/models/fondo.interface'
// // import { MonedaInterface } from 'app/modules/tesoreria/recaudo/caja/models/moneda.interface'
// // import { ClienteModel } from 'app/modules/tesoreria/clientes/models/cliente.model'
// // import { DeudaResponseInterface } from 'app/modules/tesoreria/deudas/models/deuda-response.interface'
// // import { GastoModel } from 'app/modules/tesoreria/recaudo/models/gasto.model'
// // import * as Chronos from 'app/shared/utils/chronos'
// // import { DateTime } from 'luxon'
// // import { CrudModelInterface } from '../../../shared/components/async-crud-list/crud-model.interface'
// // import { GastoItemInterface } from '../../tesoreria/recaudo/models/gastoItemInterface'
// // import { ItemModel } from '../../tesoreria/recaudo/models/item.model'
// // import { UserModel } from '../../configuraciones/usuarios/models/user.model'
// // import { ItemDetalleModel } from '../../tesoreria/recaudo/models/item-detalle.model'

// import { DateTime } from "luxon"

// export class ReciboDetalleModel implements CrudModelInterface {
//     public id: number
//     public abono: AbonoSelectModel
//     public anulado: boolean
//     public base: number
//     public caja: CajaModel
//     public cliente: ClienteModel
//     public conductor: TrabajadorSelectInterface
//     public deuda: DeudaSelectModel
//     public deudas: DeudaSaldoInterface[]
//     public dia: string
//     public documento: DocumentoModel
//     public efectivo: boolean
//     public fondos: FondoInterface[]
//     public gastos: GastoModel[]
//     public hora: DateTime
//     public igv: number
//     public inafecta: number
//     public items: ItemDetalleModel[]
//     public moneda: MonedaInterface
//     public numero: string
//     public observacion: string
//     public pagado: boolean
//     public referencia: string
//     public saldo: number
//     public serie: string
//     public sended: boolean
//     public total: number
//     public usuario: number
//     public verificado: boolean

//     constructor (reciboDetalle: ReciboDetalleResponseInterface) {
//         this.id = reciboDetalle?.id
//         this.abono = new AbonoSelectModel(reciboDetalle?.abono)
//         this.anulado = reciboDetalle?.anulado
//         this.base = reciboDetalle?.base
//         this.caja = new CajaModel(reciboDetalle?.caja)
//         this.cliente = new ClienteModel(reciboDetalle?.cliente)
//         this.conductor = reciboDetalle?.conductor
//         this.deuda = new DeudaSelectModel(reciboDetalle?.deuda)
//         this.deudas = reciboDetalle?.deudas
//         this.dia = reciboDetalle?.dia
//         this.documento = new DocumentoModel(reciboDetalle?.documento)
//         this.efectivo = reciboDetalle?.efectivo
//         this.fondos = reciboDetalle?.fondos
//         if (reciboDetalle?.gastos) {
//             this.gastos = reciboDetalle.gastos.map(g => new GastoModel(g))
//         } else {
//             this.gastos = []
//         }
//         this.hora = DateTime.fromISO(reciboDetalle?.hora)
//         this.igv = reciboDetalle?.igv
//         this.inafecta = reciboDetalle?.inafecta
//         this.items = reciboDetalle?.items.map(i => new ItemDetalleModel(i))
//         this.moneda = reciboDetalle?.moneda
//         this.numero = reciboDetalle?.numero
//         this.observacion = reciboDetalle?.observacion
//         this.referencia = reciboDetalle?.referencia
//         this.saldo = reciboDetalle?.saldo
//         this.serie = reciboDetalle?.serie
//         this.sended = reciboDetalle?.sended
//         this.total = reciboDetalle?.total
//         this.usuario = reciboDetalle?.usuario
//         this.verificado = reciboDetalle?.verificado
//     }

//     toFilter () {
//         return {}
//     }

//     toForm () {
//         return {}
//     }

//     get monedaSingular (): string {
//         return this.moneda.id === 1 ? 'SOL' : 'DÓLAR'
//     }

//     get monedaPlural (): string {
//         return this.moneda.id === 1 ? 'SOLES' : 'DÓLARES'
//     }

//     get monedaTextos (): { plural: string; singular: string } {
//         return { plural: this.monedaPlural, singular: this.monedaSingular }
//     }

//     getFooter (user: UserModel, reimprimir: boolean): string {
//         let footer = `H.PROC: ${this.hora.toFormat(
//             'yyyy-MM-dd HH:mm:ss'
//         )} ID: ${this.id} ${this.caja.usuario.nombre.toUpperCase()}`
//         if (this.anulado) {
//             footer += `
//         ****** ANULADO ******
//         H.IMP: ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`
//         }
//         if (reimprimir) {
//             footer += `
//         ****** REIMPRESIÓN ******
//         H.IMP: ${DateTime.now().toFormat(
//             'yyyy-MM-dd HH:mm:ss'
//         )} ${user.username.toUpperCase()}`
//         }
//         footer += `
//           Sistema de Gestion TCONTUR`
//         return footer
//     }

//     toRecibo (): ReciboModel {
//         return new ReciboModel({
//             id: this.id,
//             anulado: this.anulado,
//             caja: this.caja?.id,
//             cliente: this.cliente.toResponse(),
//             conductor: this.conductor?.id,
//             dia: this.dia,
//             documento: this.documento?.id,
//             efectivo: this.efectivo,
//             fondos: this.fondos,
//             hora: Chronos.dateToStringDateTime(this.hora),
//             moneda: this.moneda?.id,
//             numero: this.numero,
//             saldo: this.saldo,
//             serie: this.serie,
//             sended: this.sended,
//             total: this.total,
//             usuario: this.usuario,
//             verificado: this.verificado
//         })
//     }

//     toResponse (): ReciboDetalleResponseInterface {
//         return {
//             id: this.id,
//             abono: this.abono.toResponse(),
//             anulado: this.anulado,
//             base: this.base,
//             caja: this.caja.toResponse(),
//             cliente: this.cliente.toResponse(),
//             conductor: this.conductor,
//             deuda: this.deuda.toResponse(),
//             deudas: this.deudas,
//             dia: this.dia,
//             documento: this.documento.toResponse(),
//             efectivo: this.efectivo,
//             fondos: this.fondos,
//             gastos: this.gastos.map(g => g.toResponse()),
//             hora: Chronos.dateToStringDateTime(this.hora),
//             igv: this.igv,
//             inafecta: this.inafecta,
//             items: this.items.map(i => i.toResponse()),
//             moneda: this.moneda,
//             numero: this.numero,
//             observacion: this.observacion,
//             referencia: this.referencia,
//             saldo: this.saldo,
//             serie: this.serie,
//             sended: this.sended,
//             total: this.total,
//             usuario: this.usuario,
//             verificado: this.verificado
//         }
//     }

//     toAbonoResponse (): AbonoResponseInterface {
//         return {
//             id: this.abono.id,
//             abono: this.abono.abono,
//             anulado: this.anulado,
//             caja: this.caja.id,
//             cliente: this.cliente.toResponse(),
//             detalle: this.abono.detalle,
//             dia: this.dia,
//             hora: this.hora.toISO(),
//             moneda: this.moneda.id,
//             recibo: this.toSelectResponse(),
//             usuario: this.usuario
//         }
//     }

//     private toSelectResponse (): ReciboSelectResponseInterface {
//         return {
//             id: this.id,
//             anulado: this.anulado,
//             dia: this.dia,
//             documento: this.documento.id,
//             efectivo: this.efectivo,
//             hora: Chronos.dateToStringDateTime(this.hora),
//             moneda: this.moneda.id,
//             numero: this.numero,
//             pagado: this.pagado,
//             saldo: this.saldo,
//             serie: this.serie,
//             total: this.total,
//             usuario: this.usuario
//         }
//     }

//     toDeudaResponse (): DeudaResponseInterface {
//         return {
//             id: this.deuda.id,
//             anulado: this.anulado,
//             cantidad: this.deuda.cantidad,
//             cliente: this.cliente.toResponse(),
//             cuota: this.deuda.cuota,
//             detalle: this.deuda.detalle,
//             dia: this.dia,
//             en_reclamo: this.deuda.enReclamo,
//             hora: Chronos.dateToStringDateTime(this.hora),
//             moneda: this.moneda,
//             nombre: this.deuda.nombre,
//             precio: this.deuda.precio,
//             producto: this.items[0].producto.toResponse(),
//             recibo: this.toSelectResponse(),
//             saldo: this.deuda.saldo,
//             usuario: null
//         }
//     }

//     getConductorName (imprimirNombre: ConfiguracionesModel): string {
//         if (imprimirNombre && imprimirNombre.data === 'false') {
//             return this.conductor ? this.conductor.codigo : 'TEMPORAL'
//         } else {
//             return this.conductor
//                 ? this.conductor.nombre.slice(0, 20)
//                 : 'TEMPORAL'
//         }
//     }

//     getClienteName (imprimirNombre: ConfiguracionesModel): string {
//         if (imprimirNombre && imprimirNombre.data === 'false') {
//             return this.cliente.referenciaCompuesta
//         } else {
//             return `${this.cliente?.nombre} ${this.cliente?.referencia}`
//         }
//     }

//     getQR () {
//         let qr =
//             `|${this.documento.sunat.codigo}|${this.serie}|${this.numero}|${this.igv}|` +
//             `${this.total}|${this.dia}|`
//         if (this.documento.sunat.codigo === 1) {
//             qr += `RUC|${this.cliente.ruc}`
//         } else {
//             qr += `DNI|${this.cliente.dni}`
//         }

//         return qr
//     }

//     itemsAsItemModel (): ItemModel[] {
//         return this.items.map(
//             i =>
//                 new ItemModel({
//                     id: i.id,
//                     cantidad: i.cantidad,
//                     deuda: i.deuda?.toResponse(),
//                     igv: i.igv,
//                     moneda: this.moneda,
//                     pagado: i.pagado,
//                     precio: i.precio,
//                     producto: i.producto?.toResponse(),
//                     recibo: this.toSelectResponse(),
//                     saldo: i.precio - i.pagado,
//                     usuario: this.caja?.usuario
//                 })
//         )
//     }

//     itemsAsItemInterface (): GastoItemInterface[] {
//         return this.items.map(i => {
//             return {
//                 id: 1,
//                 concepto: i.producto?.nombre || this.deuda?.nombre,
//                 dia: i.deuda?.dia?.toFormat('yyyy-MM-dd') || this.dia,
//                 esGasto: false,
//                 monto: i.pagado,
//                 reciboId: this.id
//             }
//         })
//     }

//     gastosAsItemInterface (): GastoItemInterface[] {
//         return this.gastos.map(i => {
//             return {
//                 id: 1,
//                 concepto: i.producto?.nombre,
//                 dia: this.dia,
//                 esGasto: true,
//                 monto: i.precio,
//                 reciboId: this.id
//             }
//         })
//     }
// }
