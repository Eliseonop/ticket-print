export interface ColumnDefinition {
    w: number
    a?: string
}

export interface TableStructure {
    colRutaLado: ColumnDefinition[]
    colCondCobr: ColumnDefinition[]
    colPadHora: ColumnDefinition[]
    colControles: ColumnDefinition[]
    colPadHora2: ColumnDefinition[]
    colSumHead: ColumnDefinition[]
    colSumBody: ColumnDefinition[]
}
