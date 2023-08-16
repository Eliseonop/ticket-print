import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrintEscbufferViewComponent } from './print-escbuffer.view/print-escbuffer.view.component'
import { MaterialModule } from '../utils/shared/material.module'
import { RouterModule } from '@angular/router'
import { escbufferViewRoutes } from './print-escbuffer.routes'

@NgModule({
    declarations: [PrintEscbufferViewComponent],

    imports: [
        RouterModule.forChild(escbufferViewRoutes),
        CommonModule,
        MaterialModule
    ]
})
export class PrintEscbufferModule {}
