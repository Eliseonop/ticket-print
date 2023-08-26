import { Observable, map } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
    GeocercaModel,
    GeocercaResponseInterface
} from './models/control.model'

@Injectable({
    providedIn: 'root'
})
export class GeocercaService {
    url = 'api/apps/geocerca'

    constructor (private Http: HttpClient) {}

    getGeocercaData (): Observable<GeocercaModel[]> {
        return this.Http.get(this.url).pipe(
            map((response: GeocercaResponseInterface[]) =>
                response.map((item: GeocercaResponseInterface) =>
                    this.interfaceToModel(item)
                )
            )
        )
    }

    interfaceToModel (data: GeocercaResponseInterface): GeocercaModel {
        return new GeocercaModel(data)
    }
}
