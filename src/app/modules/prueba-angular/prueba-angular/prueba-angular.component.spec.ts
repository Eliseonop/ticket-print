import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaAngularComponent } from './prueba-angular.component';

describe('PruebaAngularComponent', () => {
  let component: PruebaAngularComponent;
  let fixture: ComponentFixture<PruebaAngularComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PruebaAngularComponent]
    });
    fixture = TestBed.createComponent(PruebaAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
