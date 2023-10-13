import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrintGeneralMainComponent } from './print-general-main/print-general-main.component'
import { PrintGeneralModalComponent } from './print-general-modal/print-general-modal.component'
import { PrintGeneralRoutes } from './print-general.routes'
import { RouterModule } from '@angular/router'
import { MaterialModule } from '../utils/shared/material.module'
import { ReactiveFormsModule } from '@angular/forms'
import { PrintGeneralService } from './print-general.service'

@NgModule({
    declarations: [PrintGeneralMainComponent, PrintGeneralModalComponent],
    imports: [
        RouterModule.forChild(PrintGeneralRoutes),
        CommonModule,
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class PrintGeneralModule {}
