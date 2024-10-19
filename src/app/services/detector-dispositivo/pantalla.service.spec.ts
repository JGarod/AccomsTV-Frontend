import { TestBed } from '@angular/core/testing';

import { PantallaService } from './pantalla.service';

describe('PantallaService', () => {
  let service: PantallaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PantallaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
