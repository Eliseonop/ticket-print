export interface SalidaPos {
    header: {
        textCompany: string
        table4Data1: string[][]
        table2Data2: string[][]
        table4Data3: string[][]
    }
    body: {
        table5Controles: string[][]
        textLiqTitle: string
        table4PadHora: string[][]
        table9SumHeader: string[][]
        table9Suministros: string[][]
    }
    footer: {
        textHoraUser: string
        textSalida: string
        textData: string
    }
}
