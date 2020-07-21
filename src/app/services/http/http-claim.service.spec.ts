import { TestBed } from '@angular/core/testing';

import { HttpClaimService } from './http-claim.service';

describe('HttpClaimService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpClaimService = TestBed.get(HttpClaimService);
    expect(service).toBeTruthy();
  });
});
