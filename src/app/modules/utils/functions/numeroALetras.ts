import { Millones } from './monedas'

export function numeroALetras (
    num: number,
    moneda = { singular: '', plural: '' },
    letrasCentavos = ''
): string {
    const data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: Math.round(num * 100) - Math.floor(num) * 100,
        letrasCentavos,
        letrasMonedaPlural: moneda?.plural, // 'Dólares', 'Soles', 'etcs'
        letrasMonedaSingular: moneda?.singular, // 'Dólar', 'Sol', 'etc'
        letrasMonedaCentavoPlural: 'CENTIMOS',
        letrasMonedaCentavoSingular: 'CENTIMO'
    }

    if (data.centavos > 0) {
        data.letrasCentavos =
            'CON ' +
            (() => {
                if (data.centavos === 1) {
                    return (
                        Millones(data.centavos) +
                        ' ' +
                        data.letrasMonedaCentavoSingular
                    )
                } else {
                    return (
                        Millones(data.centavos) +
                        ' ' +
                        data.letrasMonedaCentavoPlural
                    )
                }
            })()
    }
    if (data.enteros === 0) {
        if (data.letrasCentavos !== '') {
            if (data.letrasMonedaPlural !== '') {
                return (
                    'CERO ' +
                    data.letrasMonedaPlural +
                    ' ' +
                    data.letrasCentavos
                )
            } else {
                return 'CERO ' + data.letrasCentavos
            }
        } else {
            if (data.letrasMonedaPlural === '') {
                return 'CERO'
            }
        }
    }
    if (data.enteros === 1) {
        if (data.letrasCentavos.length > 0) {
            if (moneda.singular !== '' && moneda.plural !== '') {
                return (
                    Millones(data.enteros) +
                    ' ' +
                    data.letrasMonedaSingular +
                    ' ' +
                    data.letrasCentavos
                )
            } else {
                return Millones(data.enteros) + ' ' + data.letrasCentavos
            }
        } else {
            if (moneda.singular !== '' && moneda.plural !== '') {
                return Millones(data.enteros) + ' ' + data.letrasMonedaSingular
            } else {
                return Millones(data.enteros).trim()
            }
        }
    } else {
        if (moneda.singular !== '' && moneda.plural !== '') {
            if (data.letrasCentavos !== '') {
                return (
                    Millones(data.enteros) +
                    ' ' +
                    data.letrasMonedaPlural +
                    ' ' +
                    data.letrasCentavos
                )
            } else {
                return Millones(data.enteros) + ' ' + data.letrasMonedaPlural
            }
        } else {
            if (data.letrasCentavos !== '') {
                return Millones(data.enteros) + ' ' + data.letrasCentavos
            } else {
                return Millones(data.enteros)
            }
        }
    }
}
