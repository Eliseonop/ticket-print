export function Millones (num: number): string {
    const divisor = 1000000
    const cientos = Math.floor(num / divisor)
    const resto = num - cientos * divisor
    const strMillones = Seccion(num, divisor, 'UN MILLON', 'MILLONES')
    const strMiles = Miles(resto)
    if (strMillones === '') {
        return strMiles.trim()
    }
    if (strMiles.length > 0) {
        return strMillones + ' ' + strMiles
    } else {
        return strMillones.trim()
    }
}

export function Seccion (
    num: number,
    divisor: number,
    strSingular: string,
    strPlural: string
): string {
    const cientos = Math.floor(num / divisor)
    const resto = num - cientos * divisor
    let letras = ''
    if (cientos > 0) {
        const centenas = Centenas(cientos)
        if (cientos > 1) {
            if (centenas.length > 0) {
                if (strPlural.length > 0) {
                    letras = centenas + ' ' + strPlural
                } else {
                    letras = centenas
                }
            }
        } else {
            letras = strSingular
        }
    }
    if (resto > 0) {
        letras += ''
    }
    return letras
}

export function Centenas (num: number): string {
    const centenas = Math.floor(num / 100)
    const decenas = num - centenas * 100
    switch (centenas) {
        case 1:
            if (decenas > 0) {
                return 'CIENTO ' + Decenas(decenas)
            }
            return 'CIEN'
        case 2:
            if (decenas > 0) {
                return 'DOSCIENTOS ' + Decenas(decenas)
            }
            return 'DOSCIENTOS'
        case 3:
            if (decenas > 0) {
                return 'TRESCIENTOS ' + Decenas(decenas)
            }
            return 'TRESCIENTOS'
        case 4:
            if (decenas > 0) {
                return 'CUATROCIENTOS ' + Decenas(decenas)
            }
            return 'CUATROCIENTOS'
        case 5:
            if (decenas > 0) {
                return 'QUINIENTOS ' + Decenas(decenas)
            }
            return 'QUINIENTOS'
        case 6:
            if (decenas > 0) {
                return 'SEISCIENTOS ' + Decenas(decenas)
            }
            return 'SEISCIENTOS'
        case 7:
            if (decenas > 0) {
                return 'SETECIENTOS ' + Decenas(decenas)
            }
            return 'SETECIENTOS'
        case 8:
            if (decenas > 0) {
                return 'OCHOCIENTOS ' + Decenas(decenas)
            }
            return 'OCHOCIENTOS'
        case 9:
            if (decenas > 0) {
                return 'NOVECIENTOS ' + Decenas(decenas)
            }
            return 'NOVECIENTOS'
    }
    return Decenas(decenas)
}
export function Decenas (num: number): string {
    const decena = Math.floor(num / 10)
    const unidad = num - decena * 10
    switch (decena) {
        case 1:
            switch (unidad) {
                case 0:
                    return 'DIEZ'
                case 1:
                    return 'ONCE'
                case 2:
                    return 'DOCE'
                case 3:
                    return 'TRECE'
                case 4:
                    return 'CATORCE'
                case 5:
                    return 'QUINCE'
                default:
                    return 'DIECI' + Unidades(unidad)
            }
        case 2:
            switch (unidad) {
                case 0:
                    return 'VEINTE'
                default:
                    return 'VEINTI' + Unidades(unidad)
            }
        case 3:
            return DecenasY('TREINTA', unidad)
        case 4:
            return DecenasY('CUARENTA', unidad)
        case 5:
            return DecenasY('CINCUENTA', unidad)
        case 6:
            return DecenasY('SESENTA', unidad)
        case 7:
            return DecenasY('SETENTA', unidad)
        case 8:
            return DecenasY('OCHENTA', unidad)
        case 9:
            return DecenasY('NOVENTA', unidad)
        case 0:
            return Unidades(unidad)
        default:
            return ''
    }
}

export function Unidades (num: number): string {
    switch (num) {
        case 1:
            return 'UN'
        case 2:
            return 'DOS'
        case 3:
            return 'TRES'
        case 4:
            return 'CUATRO'
        case 5:
            return 'CINCO'
        case 6:
            return 'SEIS'
        case 7:
            return 'SIETE'
        case 8:
            return 'OCHO'
        case 9:
            return 'NUEVE'
        default:
            return ''
    }
}
export function DecenasY (strSin: string, numUnidades: number): string {
    if (numUnidades > 0) {
        return strSin + ' Y ' + Unidades(numUnidades)
    }
    return strSin.trim()
}

export function Miles (num: number): string {
    const divisor = 1000
    const cientos = Math.floor(num / divisor)
    const resto = num - cientos * divisor
    const strMiles = Seccion(num, divisor, 'MIL', 'MIL')
    const strCentenas = Centenas(resto)
    if (strMiles === '') {
        return strCentenas
    }
    if (strCentenas.length > 0) {
        return strMiles + ' ' + strCentenas
    } else {
        return strMiles
    }
}