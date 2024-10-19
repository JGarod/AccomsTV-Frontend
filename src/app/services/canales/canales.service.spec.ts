import { TestBed } from '@angular/core/testing';

import { CanalesService } from './canales.service';

describe('CanalesService', () => {
  let service: CanalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
