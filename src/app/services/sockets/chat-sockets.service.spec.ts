import { TestBed } from '@angular/core/testing';

import { ChatSocketsService } from './chat-sockets.service';

describe('ChatSocketsService', () => {
  let service: ChatSocketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSocketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
