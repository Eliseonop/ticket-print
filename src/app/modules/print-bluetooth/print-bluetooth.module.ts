import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrintBluetoothComponent } from './print-bluetooth/print-bluetooth.component'
import { PrintBlueRoutes } from './printBluetooth.routes'
import { MaterialModule } from '../utils/shared/material.module'
import { ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

@NgModule({
    declarations: [PrintBluetoothComponent],
    imports: [
        RouterModule.forChild(PrintBlueRoutes),
        CommonModule,
        MaterialModule
    ]
})
export class PrintBluetoothModule {}
