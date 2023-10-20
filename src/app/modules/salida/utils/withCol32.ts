import { TableStructure } from './anchoConfig.interface'

export const estructureFor32: TableStructure = {
    colRutaLado: [{ w: 6 }, { w: 10 }, { w: 8 }, { w: 8 }],
    colCondCobr: [{ w: 6 }, { w: 24 }],
    colPadHora: [{ w: 4 }, { w: 3 }, { w: 4 }, { w: 5, a: 'right' }],
    colControles: [
        { w: 2, a: 'left' },
        { w: 20, a: 'center' },
        { w: 2, a: 'center' },
        { w: 5, a: 'center' },
        { w: 1, a: 'right' }
    ],
    colPadHora2: [
        { w: 8, a: 'center' },
        { w: 8, a: 'center' },
        { w: 8, a: 'centen' },
        { w: 8, a: 'center' }
    ],
    colSumHead: [
        { w: 0 },
        { w: 14 },
        { w: 0 },
        { w: 4 },
        { w: 0 },
        { w: 4 },
        { w: 0 },
        { w: 4 },
        { w: 0 }
    ],
    colSumBody: [
        { w: 1 },
        { w: 4 },
        { w: 1 },
        { w: 9 },
        { w: 1 },
        { w: 4 },
        { w: 1 },
        { w: 4 },
        { w: 1 },
        { w: 4 },
        { w: 1 }
    ]
}
