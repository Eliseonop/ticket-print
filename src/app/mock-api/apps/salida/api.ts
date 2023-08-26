import { Injectable } from '@angular/core'
import { dataSalida1 } from './dataSalida1'
import { FuseMockApiService } from '@fuse/lib/mock-api'
import { cloneDeep } from 'lodash-es'
// import { dataTicket2 } from './data2'
// import { dataTicket3 } from './data3'
// import { dataTicket4 } from './data4'

@Injectable({ providedIn: 'root' })
export class SalidaMockApi {
    private _salida: any = dataSalida1

    constructor (private _fuseMockApiService: FuseMockApiService) {
        // Register Mock API handlers
        this.registerHandlers()
    }

    /**
     * Register Mock API handlers
     **/
    registerHandlers (): void {
        // -----------------------------------------------------------------------------------------------------
        // @ salida - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/apps/salida')
            .reply(() => [200, cloneDeep(this._salida)])
    }
}
