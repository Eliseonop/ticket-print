import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBluetoothComponent } from './print-bluetooth.component';

describe('PrintBluetoothComponent', () => {
  let component: PrintBluetoothComponent;
  let fixture: ComponentFixture<PrintBluetoothComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintBluetoothComponent]
    });
    fixture = TestBed.createComponent(PrintBluetoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
