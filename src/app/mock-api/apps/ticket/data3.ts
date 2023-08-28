export const dataTicket3 = {
    id: 635559,
    abono: {
        id: 271723,
        abono: 44.0,
        anulado: false,
        caja: 8001,
        cliente: 37,
        detalle: 'Recibo B021-004583',
        dia: '2023-08-17',
        hora: '2023-08-17T07:41:08.381702-05:00',
        moneda: 1,
        usuario: 17
    },
    anulado: false,
    base: 37.29,
    caja: {
        id: 8001,
        contometro_final: null,
        contometro_inicial: null,
        fin: null,
        inicio: '2023-08-17T05:22:36.732053-05:00',
        lado: null,
        saldo_inicial: 0,
        sede: {
            id: 5,
            almacen: null,
            nombre: 'CAJA JICAMARCA',
            activo: true
        },
        transferencia: null,
        usuario: {
            id: 17,
            cargo: 'DESPACHADOR',
            nombre: 'LUIS ROSALES RAMOS',
            username: 'lrosales'
        }
    },
    cliente: {
        id: 37,
        activo: true,
        cliente_id: 35,
        codigo: 'C9A765',
        direccion: null,
        display_tipo: 'Unidad',
        distrito: '',
        dni: '08295182',
        email: null,
        nombre: 'LAZARO ORE PRUDENCIO',
        padron: '60',
        persona: 'J',
        placa: 'C9A765',
        razon: '',
        referencia: '60',
        referencia_compuesta: 'P060 (C9A765)',
        ruc: null,
        telefono: null,
        tipo: 'U'
    },
    conductor: {
        id: 30,
        activo: true,
        castigado: false,
        boletos_save: true,
        codigo: 'ID30',
        conductor: true,
        dni: '42599763',
        estado: 'T',
        nombre: 'LAZARO CHAVEZ, JORGE ARMANDO',
        vencido: false,
        vigente: true,
        vencimiento: '2027-10-03'
    },
    dia: '2023-08-17',
    deuda: null,
    deudas: [],
    documento: {
        id: 22,
        activo: true,
        es_egreso: false,
        nombre: 'BOLETA ELECTRONICA',
        numero: 4594,
        sede: {
            id: 5,
            almacen: null,
            nombre: 'CAJA JICAMARCA',
            activo: true
        },
        serie: 'B021',
        sunat: {
            id: 4,
            codigo: 3,
            nombre: 'BOLETA',
            es_compra: true
        }
    },
    efectivo: true,
    fondos: [],
    hora: '2023-08-17T07:41:08.328426-05:00',
    igv: 6.71,
    items: [
        {
            id: 1186700,
            base: 25.42,
            cantidad: 1.0,
            deuda: {
                id: 522256,
                anulado: false,
                cantidad: 1.0,
                cliente: 37,
                cuota: 0.0,
                dia: '2023-08-17',
                en_reclamo: false,
                hora: '2023-08-17T07:33:47.657487-05:00',
                nombre: 'APORTE ESPECIAL',
                precio: 30.0,
                producto: 231,
                saldo: 0.0
            },
            efectivo: true,
            igv: 4.58,
            inafecta: 0.0,
            moneda: 1,
            observacion: '',
            pagado: 30.0,
            precio: 30.0,
            precio_unit: 30.0,
            producto: {
                id: 231,
                activo: true,
                automatico: true,
                cliente: 'U',
                codigo: '439',
                combustible: false,
                es_gasto: false,
                fondo: false,
                fracciones: false,
                igv: true,
                isc: 0,
                moneda: 1,
                nombre: 'APORTE ESPECIAL',
                precio: 30.0,
                servicio: true,
                stock: 0,
                variable: true
            },
            recibo: {
                id: 635559,
                anulado: false,
                dia: '2023-08-17',
                documento: 22,
                efectivo: true,
                hora: '2023-08-17T07:41:08.328426-05:00',
                moneda: 1,
                numero: '004583',
                pagado: true,
                saldo: 0.0,
                sended: true,
                serie: 'B021',
                total: 44.0,
                usuario: 17
            },
            saldo: 0.0,
            usuario: {
                id: 17,
                cargo: 'DESPACHADOR',
                nombre: 'LUIS ROSALES RAMOS',
                username: 'lrosales'
            }
        },
        {
            id: 1186701,
            base: 2.12,
            cantidad: 1.0,
            deuda: {
                id: 522258,
                anulado: false,
                cantidad: 1.0,
                cliente: 37,
                cuota: 0.0,
                dia: '2023-08-17',
                en_reclamo: false,
                hora: '2023-08-17T07:33:47.754428-05:00',
                nombre: 'BOLETOS',
                precio: 2.5,
                producto: 9,
                saldo: 0.0
            },
            efectivo: true,
            igv: 0.38,
            inafecta: 0.0,
            moneda: 1,
            observacion: '',
            pagado: 2.5,
            precio: 2.5,
            precio_unit: 2.5,
            producto: {
                id: 9,
                activo: true,
                automatico: true,
                cliente: 'U',
                codigo: '6',
                combustible: false,
                es_gasto: false,
                fondo: false,
                fracciones: false,
                igv: true,
                isc: 0,
                moneda: 1,
                nombre: 'BOLETOS',
                precio: 2.5,
                servicio: true,
                stock: 99332000,
                variable: false
            },
            recibo: {
                id: 635559,
                anulado: false,
                dia: '2023-08-17',
                documento: 22,
                efectivo: true,
                hora: '2023-08-17T07:41:08.328426-05:00',
                moneda: 1,
                numero: '004583',
                pagado: true,
                saldo: 0.0,
                sended: true,
                serie: 'B021',
                total: 44.0,
                usuario: 17
            },
            saldo: 0.0,
            usuario: {
                id: 17,
                cargo: 'DESPACHADOR',
                nombre: 'LUIS ROSALES RAMOS',
                username: 'lrosales'
            }
        },
        {
            id: 1186702,
            base: 2.97,
            cantidad: 1.0,
            deuda: {
                id: 522262,
                anulado: false,
                cantidad: 1.0,
                cliente: 37,
                cuota: 0.0,
                dia: '2023-08-17',
                en_reclamo: false,
                hora: '2023-08-17T07:33:47.935517-05:00',
                nombre: 'GPS',
                precio: 3.5,
                producto: 5,
                saldo: 0.0
            },
            efectivo: true,
            igv: 0.53,
            inafecta: 0.0,
            moneda: 1,
            observacion: '',
            pagado: 3.5,
            precio: 3.5,
            precio_unit: 3.5,
            producto: {
                id: 5,
                activo: true,
                automatico: true,
                cliente: 'U',
                codigo: '11',
                combustible: false,
                es_gasto: false,
                fondo: false,
                fracciones: false,
                igv: true,
                isc: 0,
                moneda: 1,
                nombre: 'GPS',
                precio: 3.5,
                servicio: true,
                stock: -345000,
                variable: false
            },
            recibo: {
                id: 635559,
                anulado: false,
                dia: '2023-08-17',
                documento: 22,
                efectivo: true,
                hora: '2023-08-17T07:41:08.328426-05:00',
                moneda: 1,
                numero: '004583',
                pagado: true,
                saldo: 0.0,
                sended: true,
                serie: 'B021',
                total: 44.0,
                usuario: 17
            },
            saldo: 0.0,
            usuario: {
                id: 17,
                cargo: 'DESPACHADOR',
                nombre: 'LUIS ROSALES RAMOS',
                username: 'lrosales'
            }
        },
        {
            id: 1186703,
            base: 1.69,
            cantidad: 1.0,
            deuda: {
                id: 522263,
                anulado: false,
                cantidad: 1.0,
                cliente: 37,
                cuota: 0.0,
                dia: '2023-08-17',
                en_reclamo: false,
                hora: '2023-08-17T07:33:47.992981-05:00',
                nombre: 'INSUMO DESINFECCION',
                precio: 2.0,
                producto: 218,
                saldo: 0.0
            },
            efectivo: true,
            igv: 0.31,
            inafecta: 0.0,
            moneda: 1,
            observacion: '',
            pagado: 2.0,
            precio: 2.0,
            precio_unit: 2.0,
            producto: {
                id: 218,
                activo: true,
                automatico: true,
                cliente: 'U',
                codigo: '102',
                combustible: false,
                es_gasto: false,
                fondo: false,
                fracciones: false,
                igv: true,
                isc: 0,
                moneda: 1,
                nombre: 'INSUMO DESINFECCION',
                precio: 2.0,
                servicio: true,
                stock: 0,
                variable: false
            },
            recibo: {
                id: 635559,
                anulado: false,
                dia: '2023-08-17',
                documento: 22,
                efectivo: true,
                hora: '2023-08-17T07:41:08.328426-05:00',
                moneda: 1,
                numero: '004583',
                pagado: true,
                saldo: 0.0,
                sended: true,
                serie: 'B021',
                total: 44.0,
                usuario: 17
            },
            saldo: 0.0,
            usuario: {
                id: 17,
                cargo: 'DESPACHADOR',
                nombre: 'LUIS ROSALES RAMOS',
                username: 'lrosales'
            }
        },
        {
            id: 1186704,
            base: 0.85,
            cantidad: 1.0,
            deuda: {
                id: 522264,
                anulado: false,
                cantidad: 1.0,
                cliente: 37,
                cuota: 0.0,
                dia: '2023-08-17',
                en_reclamo: false,
                hora: '2023-08-17T07:33:48.041473-05:00',
                nombre: 'LIMP/ BUSES',
                precio: 1.0,
                producto: 11,
                saldo: 0.0
            },
            efectivo: true,
            igv: 0.15,
            inafecta: 0.0,
            moneda: 1,
            observacion: '',
            pagado: 1.0,
            precio: 1.0,
            precio_unit: 1.0,
            producto: {
                id: 11,
                activo: true,
                automatico: true,
                cliente: 'U',
                codigo: '8',
                combustible: false,
                es_gasto: false,
                fondo: false,
                fracciones: false,
                igv: true,
                isc: 0,
                moneda: 1,
                nombre: 'LIMP/ BUSES',
                precio: 1.0,
                servicio: true,
                stock: -103000,
                variable: false
            },
            recibo: {
                id: 635559,
                anulado: false,
                dia: '2023-08-17',
                documento: 22,
                efectivo: true,
                hora: '2023-08-17T07:41:08.328426-05:00',
                moneda: 1,
                numero: '004583',
                pagado: true,
                saldo: 0.0,
                sended: true,
                serie: 'B021',
                total: 44.0,
                usuario: 17
            },
            saldo: 0.0,
            usuario: {
                id: 17,
                cargo: 'DESPACHADOR',
                nombre: 'LUIS ROSALES RAMOS',
                username: 'lrosales'
            }
        },
        {
            id: 1186705,
            base: 4.24,
            cantidad: 1.0,
            deuda: {
                id: 522265,
                anulado: false,
                cantidad: 1.0,
                cliente: 37,
                cuota: 0.0,
                dia: '2023-08-17',
                en_reclamo: false,
                hora: '2023-08-17T07:33:48.083992-05:00',
                nombre: 'LIMP/DESINF',
                precio: 5.0,
                producto: 7,
                saldo: 0.0
            },
            efectivo: true,
            igv: 0.76,
            inafecta: 0.0,
            moneda: 1,
            observacion: '',
            pagado: 5.0,
            precio: 5.0,
            precio_unit: 5.0,
            producto: {
                id: 7,
                activo: true,
                automatico: true,
                cliente: 'U',
                codigo: '4',
                combustible: false,
                es_gasto: false,
                fondo: false,
                fracciones: false,
                igv: true,
                isc: 0,
                moneda: 1,
                nombre: 'LIMP/DESINF',
                precio: 5.0,
                servicio: true,
                stock: -103000,
                variable: false
            },
            recibo: {
                id: 635559,
                anulado: false,
                dia: '2023-08-17',
                documento: 22,
                efectivo: true,
                hora: '2023-08-17T07:41:08.328426-05:00',
                moneda: 1,
                numero: '004583',
                pagado: true,
                saldo: 0.0,
                sended: true,
                serie: 'B021',
                total: 44.0,
                usuario: 17
            },
            saldo: 0.0,
            usuario: {
                id: 17,
                cargo: 'DESPACHADOR',
                nombre: 'LUIS ROSALES RAMOS',
                username: 'lrosales'
            }
        }
    ],
    inafecta: 0.0,
    modifica: null,
    moneda: {
        id: 1,
        nombre: 'Nuevo Sol',
        codigo: 'S/'
    },
    numero: '004583',
    observacion: null,
    pagado: true,
    saldo: 0.0,
    sended: true,
    serie: 'B021',
    ser_num: 'B021-004583',
    total: 44.0,
    usuario: 17
}