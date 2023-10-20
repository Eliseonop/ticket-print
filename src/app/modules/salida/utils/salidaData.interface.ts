export interface SalidaPos {
    header: {
        textCompany: string
        rutaLado: string[][]
        condCobr: string[][]
        padHora: string[][]
    }
    body: {
        controles: string[][]
        liqBoletos: string
        padHora2: string[][]
        suministrosHead: string[][]
        suministrosBody: string[][]
    }
    footer: {
        textHoraUser: string
        textSalida: string
        textData: string
    }
}
