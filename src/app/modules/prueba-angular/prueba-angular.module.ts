import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PruebaAngularComponent } from './prueba-angular/prueba-angular.component'
import { RouterModule } from '@angular/router'
import { pruebaAngularRoutes } from './prueba-angular.routes'
import { MaterialModule } from '../utils/shared/material.module'
import { AbstratTestComponent } from './abstrat-test/abstrat-test.component'

@NgModule({
    declarations: [PruebaAngularComponent],
    imports: [
        RouterModule.forChild(pruebaAngularRoutes),
        CommonModule,
        MaterialModule
    ]
})
export class PruebaAngularModule {}
