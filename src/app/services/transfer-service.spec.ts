import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { of, throwError } from 'rxjs';

import { TransferService, Transfer, TransferDto } from './transfer-service';

describe('TransferService', () => {
  let service: TransferService;
  let httpSpy: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };

  const baseUrl = 'http://localhost:8097/transfers';

  const mockTransfer: Transfer = {
    id: 1,
    sourceAccount: '1234567890',
    destinationAccount: '0987654321',
    amount: 500,
    fee: 10,
    schedulingDate: '2026-04-01',
    transferDate: '2026-04-05',
  };

  const mockDto: TransferDto = {
    sourceAccount: '1234567890',
    destinationAccount: '0987654321',
    amount: 500,
    transferDate: '2026-04-05',
  };

  beforeEach(() => {
    httpSpy = { get: vi.fn(), post: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        TransferService,
        { provide: HttpClient, useValue: httpSpy as unknown as HttpClient },
      ],
    });

    service = TestBed.inject(TransferService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('scheduleTransfer', () => {
    it('should POST to the correct URL and return the created transfer', () => {
      httpSpy.post.mockReturnValue(of(mockTransfer));

      let result: Transfer | undefined;
      service.scheduleTransfer(mockDto).subscribe((t) => (result = t));

      expect(httpSpy.post).toHaveBeenCalledWith(baseUrl, mockDto);
      expect(result).toEqual(mockTransfer);
    });

    it('should propagate errors from the HTTP call', () => {
      const error = new Error('Server error');
      httpSpy.post.mockReturnValue(throwError(() => error));

      let caught: unknown;
      service.scheduleTransfer(mockDto).subscribe({ error: (e) => (caught = e) });

      expect(caught).toBe(error);
    });
  });

  describe('getTransfers', () => {
    it('should GET from the correct URL and return a list of transfers', () => {
      httpSpy.get.mockReturnValue(of([mockTransfer]));

      let result: Transfer[] | undefined;
      service.getTransfers().subscribe((list) => (result = list));

      expect(httpSpy.get).toHaveBeenCalledWith(baseUrl);
      expect(result).toEqual([mockTransfer]);
    });

    it('should return an empty array when server returns empty list', () => {
      httpSpy.get.mockReturnValue(of([]));

      let result: Transfer[] | undefined;
      service.getTransfers().subscribe((list) => (result = list));

      expect(result).toEqual([]);
    });

    it('should propagate errors from the HTTP call', () => {
      const error = new Error('Network error');
      httpSpy.get.mockReturnValue(throwError(() => error));

      let caught: unknown;
      service.getTransfers().subscribe({ error: (e) => (caught = e) });

      expect(caught).toBe(error);
    });
  });
});
