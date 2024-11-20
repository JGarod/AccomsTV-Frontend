import { TestBed } from '@angular/core/testing';

import { PasswordUserService } from './password-user.service';

describe('PasswordUserService', () => {
  let service: PasswordUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
