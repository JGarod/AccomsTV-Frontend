import { TestBed } from '@angular/core/testing';

import { AuthStreamService } from './auth-stream.service';

describe('AuthStreamService', () => {
  let service: AuthStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
