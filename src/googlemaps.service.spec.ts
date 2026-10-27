import { TestBed } from '@angular/core/testing';

import { GooglemapsService } from './googlemaps.service';

declare function describe(description: string, specDefinitions: () => void): void;
declare function beforeEach(action: () => void): void;
declare function it(expectation: string, assertion: () => void): void;
declare function expect(actual: unknown): { toBeTruthy(): void };

describe('GooglemapsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GooglemapsService = TestBed.get(GooglemapsService);
    expect(service).toBeTruthy();
  });
});
