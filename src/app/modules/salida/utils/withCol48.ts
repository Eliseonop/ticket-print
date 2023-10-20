import { TableStructure } from './anchoConfig.interface'

export const estructureFor48: TableStructure = {
    colRutaLado: [{ w: 12 }, { w: 12 }, { w: 12 }, { w: 12 }],
    colCondCobr: [{ w: 12 }, { w: 36 }],
    colPadHora: [{ w: 6 }, { w: 6 }, { w: 6 }, { w: 6, a: 'right' }],
    colControles: [
        { w: 4, a: 'left' },
        { w: 29, a: 'center' },
        { w: 5, a: 'center' },
        { w: 9, a: 'center' },
        { w: 1, a: 'right' }
    ],
    colPadHora2: [
        { w: 12, a: 'left' },
        { w: 12, a: 'left' },
        { w: 12, a: 'right' },
        { w: 12, a: 'right' }
    ],
    colSumHead: [
        { w: 1 },
        { w: 22 },
        { w: 1 },
        { w: 7 },
        { w: 1 },
        { w: 7 },
        { w: 1 },
        { w: 7 },
        { w: 1 }
    ],
    colSumBody: [
        { w: 1 },
        { w: 7 },
        { w: 1 },
        { w: 14 },
        { w: 1 },
        { w: 7 },
        { w: 1 },
        { w: 7 },
        { w: 1 },
        { w: 7 },
        { w: 1 }
    ]
}
