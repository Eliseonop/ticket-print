import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
    selector: 'app-abstrat-test',
    templateUrl: './abstrat-test.component.html',
    styleUrls: ['./abstrat-test.component.scss']
})
export abstract class AbstratTestComponent implements OnInit {
    @Input() id: string

    constructor (private router: Router) {}

    ngOnInit (): void {
        console.log(this.id)
    }
}
