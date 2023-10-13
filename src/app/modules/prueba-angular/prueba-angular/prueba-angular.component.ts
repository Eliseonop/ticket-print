import { Component } from '@angular/core'
import { AbstratTestComponent } from '../abstrat-test/abstrat-test.component'

@Component({
    selector: 'app-prueba-angular',
    templateUrl: './prueba-angular.component.html',
    styleUrls: ['./prueba-angular.component.scss']
})
export class PruebaAngularComponent extends AbstratTestComponent {}
