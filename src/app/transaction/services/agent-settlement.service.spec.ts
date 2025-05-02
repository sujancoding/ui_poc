import { TestBed } from '@angular/core/testing';

import { AgentSettlementService } from './agent-settlement.service';

describe('AgentSettlementService', () => {
  let service: AgentSettlementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentSettlementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
