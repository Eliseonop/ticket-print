import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermalPrintListComponent } from './thermal-print-list.component';

describe('ThermalPrintListComponent', () => {
  let component: ThermalPrintListComponent;
  let fixture: ComponentFixture<ThermalPrintListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThermalPrintListComponent]
    });
    fixture = TestBed.createComponent(ThermalPrintListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
