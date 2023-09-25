import { TestBed } from '@angular/core/testing';

import { PrintBluetoothService } from './print-bluetooth.service';

describe('PrintBluetoothService', () => {
  let service: PrintBluetoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintBluetoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
