import { TestBed } from '@angular/core/testing';

import { ChatonStateService } from './chaton-state.service';

describe('ChatonStateService', () => {
  let service: ChatonStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatonStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
