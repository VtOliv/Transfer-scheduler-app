import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { of, throwError } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TransferList } from './transfer-list';
import { TransferService } from '../../services/transfer-service';

describe('TransferList', () => {
  registerLocaleData(localePt);
  let component: TransferList;
  let fixture: ComponentFixture<TransferList>;
  let transferServiceSpy: { getTransfers: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    transferServiceSpy = { getTransfers: vi.fn().mockReturnValue(of([])) };

    await TestBed.configureTestingModule({
      imports: [TransferList],
      providers: [
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: TransferService, useValue: transferServiceSpy as unknown as TransferService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load transfers on init', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    transferServiceSpy.getTransfers.mockReturnValue(
      of([
        {
          id: 1,
          sourceAccount: '1234567890',
          destinationAccount: '0987654321',
          amount: 100,
          fee: 2,
          schedulingDate: '2026-04-01',
          transferDate: '2026-04-02'
        }
      ])
    );

    fixture.detectChanges();

    expect(transferServiceSpy.getTransfers).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].id).toBe(1);
    consoleSpy.mockRestore();
  });

  it('should keep data empty when service fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    transferServiceSpy.getTransfers.mockReturnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(transferServiceSpy.getTransfers).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual([]);
    consoleSpy.mockRestore();
  });
});
