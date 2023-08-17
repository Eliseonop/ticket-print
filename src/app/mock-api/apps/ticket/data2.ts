export const dataTicket2 = {
    id: 635920,
    abono: {
        id: 271793,
        abono: 100.0,
        anulado: false,
        caja: 8001,
        cliente: 50,
        detalle: 'Recibo P001-024813',
        dia: '2023-08-17',
        hora: '2023-08-17T09:56:30.478483-05:00',
        moneda: 1,
        usuario: 17
    },
    anulado: false,
    base: 0.0,
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
        id: 50,
        activo: true,
        cliente_id: 44,
        codigo: 'B8L734',
        direccion: null,
        display_tipo: 'Unidad',
        distrito: '',
        dni: '04016415',
        email: null,
        nombre: 'TAPIA DIAZ MARCO',
        padron: '82',
        persona: 'J',
        placa: 'B8L734',
        razon: '',
        referencia: '82',
        referencia_compuesta: 'P082 (B8L734)',
        ruc: null,
        telefono: null,
        tipo: 'U'
    },
    conductor: {
        id: 35,
        activo: true,
        castigado: false,
        boletos_save: true,
        codigo: '35',
        conductor: true,
        dni: '41275731',
        estado: 'R',
        nombre: 'CHAMORRO CABELLO, ANDRES YOEL',
        vencido: false,
        vigente: true,
        vencimiento: '2025-03-01'
    },
    dia: '2023-08-17',
    deuda: null,
    deudas: [
        {
            id: 102371,
            dia: '2022-01-21',
            nombre: 'AHORRO VARIOS',
            inicial: 999999.0,
            saldo: 965499.0
        }
    ],
    documento: {
        id: 12,
        activo: true,
        es_egreso: false,
        nombre: 'INTERNO',
        numero: 24842,
        sede: {
            id: 5,
            almacen: null,
            nombre: 'CAJA JICAMARCA',
            activo: true
        },
        serie: 'P001',
        sunat: {
            id: 1,
            codigo: 0,
            nombre: 'INTERNO',
            es_compra: true
        }
    },
    efectivo: true,
    fondos: [
        {
            id: 40,
            nombre: 'AHORRO VARIOS',
            total: 1300.0
        }
    ],
    hora: '2023-08-17T09:56:30.460645-05:00',
    igv: 0.0,
    items: [
        {
            id: 1187438,
            base: 0.0,
            cantidad: 1.0,
            deuda: {
                id: 102371,
                anulado: false,
                cantidad: 1.0,
                cliente: 50,
                cuota: 100.0,
                dia: '2022-01-21',
                en_reclamo: false,
                hora: '2022-01-21T11:41:35.278570-05:00',
                nombre: 'AHORRO VARIOS',
                precio: 999999.0,
                producto: 40,
                saldo: 965499.0
            },
            efectivo: true,
            igv: 0.0,
            inafecta: 100.0,
            moneda: 1,
            observacion: '',
            pagado: 100.0,
            precio: 100.0,
            precio_unit: 100.0,
            producto: {
                id: 40,
                activo: true,
                automatico: false,
                cliente: 'U',
                codigo: '39',
                combustible: false,
                es_gasto: false,
                fondo: true,
                fracciones: false,
                igv: null,
                isc: 0,
                moneda: 1,
                nombre: 'AHORRO VARIOS',
                precio: 30.0,
                servicio: true,
                stock: -206000,
                variable: true
            },
            recibo: {
                id: 635920,
                anulado: false,
                dia: '2023-08-17',
                documento: 12,
                efectivo: true,
                hora: '2023-08-17T09:56:30.460645-05:00',
                moneda: 1,
                numero: '024813',
                pagado: true,
                saldo: 0.0,
                sended: null,
                serie: 'P001',
                total: 100.0,
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
    inafecta: 100.0,
    modifica: null,
    moneda: {
        id: 1,
        nombre: 'Nuevo Sol',
        codigo: 'S/'
    },
    numero: '024813',
    observacion: null,
    pagado: true,
    saldo: 0.0,
    sended: null,
    serie: 'P001',
    ser_num: 'P001-024813',
    total: 100.0,
    usuario: 17
}
