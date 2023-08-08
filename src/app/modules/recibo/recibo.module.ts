import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReciboViewComponent } from './recibo-view/recibo-view.component'

import { reciboRoutes } from './recibo.routes'
import { RouterModule } from '@angular/router'
import { MaterialModule } from '../utils/shared/material.module'

@NgModule({
    declarations: [ReciboViewComponent],
    imports: [RouterModule.forChild(reciboRoutes), CommonModule, MaterialModule]
})
export class ReciboModule {}
