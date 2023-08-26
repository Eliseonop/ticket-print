import { Injectable } from '@angular/core'
import { FuseMockApiService } from '@fuse/lib/mock-api'
import { cloneDeep } from 'lodash-es'
import { dataGeocercas } from './data'

@Injectable({ providedIn: 'root' })
export class GeocercaMockApi {
    private _ticket: any = dataGeocercas

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
            .onGet('api/apps/geocerca')
            .reply(() => [200, cloneDeep(this._ticket)])
    }
}
