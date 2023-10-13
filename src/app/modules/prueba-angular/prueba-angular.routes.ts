import { Route } from '@angular/router'
import { PruebaAngularComponent } from './prueba-angular/prueba-angular.component'

export const pruebaAngularRoutes: Route[] = [
    {
        path: '',
        component: PruebaAngularComponent,
        children: [
            {
                path: ':id',
                component: PruebaAngularComponent
            }
        ]
    }
]
