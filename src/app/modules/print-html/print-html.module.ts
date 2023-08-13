import { ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PrintHtmlListComponent } from './print-html-list/print-html-list.component'
import { PrintHtmlRoutes } from './print-html.routes'
import { RouterModule } from '@angular/router'
import { MaterialModule } from '../utils/shared/material.module'
import { NgxPrintElementModule } from 'ngx-print-element'
@NgModule({
    declarations: [PrintHtmlListComponent],
    imports: [
        RouterModule.forChild(PrintHtmlRoutes),
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxPrintElementModule
    ]
})
export class PrintHtmlModule {}
