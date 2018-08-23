import { TestBed, inject } from '@angular/core/testing';

import { BillService } from './bill.service';

describe('RentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillService]
    });
  });

  it('should be created', inject([BillService], (service: BillService) => {
    expect(service).toBeTruthy();
  }));
});
