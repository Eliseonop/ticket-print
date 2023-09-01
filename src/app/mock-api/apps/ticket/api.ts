import { Injectable } from '@angular/core'
import { dataTicket } from './data'
import { FuseMockApiService } from '@fuse/lib/mock-api'
import { cloneDeep } from 'lodash-es'
import { dataTicket2 } from './data2'
import { dataTicket3 } from './data3'
import { dataTicket4 } from './data4'

@Injectable({ providedIn: 'root' })
export class TicketMockApi {
    private _ticket: any = dataTicket4

    constructor (private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers()
    }

    /**
     * Register Mock API handlers
     **/
    registerHandlers (): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Ticket - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/ticket')
            .reply(() => [200, cloneDeep(this._ticket)])
    }
}
