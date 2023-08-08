import { Observable, map } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReciboDetalleModel } from './models/ticket.models'
import { IReciboDetalle } from './models/ticket.interface'
import { ReciboAbstractService } from './recibo.abstract.service'

@Injectable({
    providedIn: 'root'
})
export class TicketService extends ReciboAbstractService {
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
