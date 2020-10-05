import { TestBed } from '@angular/core/testing';

import { LanguageServiceService } from './language-service.service';

describe('LanguageServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LanguageServiceService = TestBed.get(LanguageServiceService);
    expect(service).toBeTruthy();
  });
});
