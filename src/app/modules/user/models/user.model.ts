import { UserPreferencesInterface } from 'app/core/user/user-preferences.interface'
import { Deserializable } from 'app/shared/models/deserializable.model'
import * as Helpers from 'app/shared/utils/helpers'
import { RouterStateSnapshot } from '@angular/router'

export class UserModel implements Deserializable {
    public id: number
    public cargo: string
    public email: string
    public empresa: string
    public estado: string
    public error: string
    public genero: string
    public urls: string[]
    public permisos: {
        id: number
        nombre: string
    }[]
    public preferences: UserPreferencesInterface
    public lado: boolean
    public message: string
    public nombre: string
    public photoUrl?: string
    public roles: {
        id: number
        nombre: string
    }[]
    public ruta: number
    public rutas: {
        orden: number
        ruta: number
    }[] = []
    public soporte: number
    public token: string
    public trabajador: number
    public username: string
    //getters
    isDespacho: boolean
    isDeveloper: boolean
    isInventario: boolean
    isMonitoreo: boolean
    isPropietario: boolean
    isRestricted: boolean
    isSistema: boolean
    isSoporte: boolean
    isTesoreria: boolean
    isTrabajador: boolean

    checkGroups () {
        this.isSoporte = !!this.soporte
        if (this.roles) {
            this.isDeveloper = this.roles.some(
                p => p.nombre === 'Developer TCONTUR'
            )
            this.isSistema =
                this.isDeveloper ||
                this.roles.some(p => p.nombre === 'Sistemas')
            this.isDespacho =
                this.isSistema ||
                this.isSoporte ||
                this.roles.some(p => p.nombre === 'Despacho')
            this.isMonitoreo =
                this.isSistema ||
                this.isSoporte ||
                this.roles.some(p => p.nombre === 'Monitoreo')
            this.isInventario =
                this.isSistema ||
                this.roles.some(p => p.nombre === 'Inventario')
            this.isTesoreria =
                this.isSistema || this.roles.some(p => p.nombre === 'Tesorería')
            this.isPropietario = this.roles.some(
                p => p.nombre === 'Propietario'
            )
            this.isTrabajador = this.roles.some(p => p.nombre === 'Trabajador')
            this.isRestricted =
                (this.isTrabajador || this.isPropietario) &&
                !(
                    this.isDespacho ||
                    this.isInventario ||
                    this.isMonitoreo ||
                    this.isSoporte ||
                    this.isTesoreria
                )
        }
        // console.log('isSoporte', this.isSoporte);
        // console.log('isDeveloper', this.isDeveloper);
        // console.log('isSistema', this.isSistema);
        // console.log('isDespacho', this.isDespacho);
        // console.log('isInventario', this.isInventario);
        // console.log('isMonitoreo', this.isMonitoreo);
        // console.log('isPropietario', this.isPropietario);
        // console.log('isTesoreria', this.isTesoreria);
        // console.log('isTrabajador', this.isTrabajador);
        // console.log('isRestricted', this.isRestricted);
    }

    deserialize (input: any): this {
        Object.assign(this, input)
        if (this.preferences === undefined) {
            this.preferences = {
                theme: 'dark'
            }
        } else {
            if (this.preferences.theme === undefined) {
                this.preferences.theme = 'dark'
            }
        }
        if (Helpers.isNullOrUndefined(input)) {
            this.photoUrl = 'assets/images/avatars/man.png'
        } else {
            this.photoUrl = this.getPhotoUrl(input.photoUrl, input.genero)
        }
        this.ruta = this.rutas[0]?.ruta
        this.checkGroups()
        return this
    }

    getPhotoUrl (photoUrl: string, genero: boolean): string {
        if (Helpers.isNullOrUndefined(photoUrl)) {
            if (genero) {
                return 'assets/images/avatars/man.png'
            } else {
                return 'assets/images/avatars/woman.png'
            }
        } else {
            return photoUrl
        }
    }

    setRuta (ruta: number) {
        this.ruta = ruta
    }

    canList (state: RouterStateSnapshot) {
        if (this.urls !== undefined) {
            return this.urls.find(p => p === state.url.slice(1).split('/')[0])
        } else {
            return true
        }
    }
}
