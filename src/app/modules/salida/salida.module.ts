import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SalidaViewComponent } from './salida-view/salida-view.component'
import { RouterModule } from '@angular/router'
import { salidaRoutes } from './salida.routes'
import { MaterialModule } from '../utils/shared/material.module'
import { ReactiveFormsModule } from '@angular/forms'

@NgModule({
    declarations: [SalidaViewComponent],
    imports: [
        RouterModule.forChild(salidaRoutes),
        MaterialModule,
        ReactiveFormsModule
    ]
})
export class SalidaModule {}
