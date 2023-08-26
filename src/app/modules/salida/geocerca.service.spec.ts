import { TestBed } from '@angular/core/testing';

import { GeocercaService } from './geocerca.service';

describe('GeocercaService', () => {
  let service: GeocercaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeocercaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
