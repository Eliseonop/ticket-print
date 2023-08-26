import { Observable, map } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReciboDetalleModel } from './models/reciboDetalle.models'
import { IReciboDetalle } from './models/reciboDetalle.interface'
import { ReciboAbstractService } from './recibo.abstract.service'

@Injectable({
    providedIn: 'root'
})
export class ReciboDetalleService extends ReciboAbstractService {
    url = 'api/apps/ticket'

    constructor (private httpClient: HttpClient) {
        super(httpClient)
    }

    getTicketData (): Observable<ReciboDetalleModel> {
        return this.httpClient.get<IReciboDetalle>(this.url).pipe(
            map((data: IReciboDetalle) => {
                return this.InterfaceToModel(data)
            })
        )
    }

    InterfaceToModel (data: IReciboDetalle) {
        return new ReciboDetalleModel(data)
    }
}
