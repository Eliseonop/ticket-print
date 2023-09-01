export interface StructureData {
    header: {
        viewLogo: boolean
        nombreEmpresa: string | null
        ruc: string | null
        direccion: string | null
        tableDatos: any[]
    }
    body: {
        items: any[]
        grav: any[]
        iva: any[]
        total: any[]
        fondos: any[]
        deudas: any[]
        saldo: any[]
    }
    footer: {
        totalLetras: string | null
        pago: any | null
        qr: any | null
        footer: any | null
        anulado: boolean
        reimprimir: boolean
        user: string | null
        empresa: string | null
    }
}
