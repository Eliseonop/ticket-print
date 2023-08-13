import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ThermalPrintListComponent } from './thermal-print-list/thermal-print-list.component'
import { RouterModule } from '@angular/router'
import { thermalRoutes } from './thermal-print.routes'
import { MaterialModule } from '../utils/shared/material.module'
import { FormsModule } from '@angular/forms'
import { NgxPrinterModule } from 'ngx-printer'
@NgModule({
    declarations: [ThermalPrintListComponent],
    imports: [
        RouterModule.forChild(thermalRoutes),
        CommonModule,
        MaterialModule,
        FormsModule,
        NgxPrinterModule.forRoot({
            printOpenWindow: true,
            printPreviewOnly: false
        })
    ]
})
export class ThermalPrintsModule {}
