import { TestBed } from '@angular/core/testing';

import { PixiService } from './pixi.service';

describe('PixiService', () => {
  let service: PixiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PixiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
