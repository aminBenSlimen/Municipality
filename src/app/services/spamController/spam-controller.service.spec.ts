import { TestBed } from '@angular/core/testing';

import { SpamControllerService } from './spam-controller.service';

describe('SpamControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpamControllerService = TestBed.get(SpamControllerService);
    expect(service).toBeTruthy();
  });
});
