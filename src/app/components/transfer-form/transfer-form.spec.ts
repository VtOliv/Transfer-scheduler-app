import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TransferForm } from './transfer-form';
import { TransferService } from '../../services/transfer-service';

describe('TransferForm', () => {
  let component: TransferForm;
  let fixture: ComponentFixture<TransferForm>;
  let transferServiceSpy: { scheduleTransfer: ReturnType<typeof vi.fn> };
  let snackBarSpy: { open: ReturnType<typeof vi.fn> };
  let router: Router;
  let routerNavigateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    transferServiceSpy = { scheduleTransfer: vi.fn() };
    snackBarSpy = { open: vi.fn() };
    TestBed.configureTestingModule({
      imports: [TransferForm],
      providers: [
        provideRouter([]),
        { provide: TransferService, useValue: transferServiceSpy as unknown as TransferService }
      ]
    });
    TestBed.overrideComponent(TransferForm, {
      set: {
        providers: [{ provide: MatSnackBar, useValue: snackBarSpy as unknown as MatSnackBar }]
      }
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(TransferForm);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    routerNavigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should warn when submitting invalid form', () => {
    component.submit();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Preencha os campos obrigatórios corretamente.',
      'Fechar',
      expect.objectContaining({ panelClass: ['snackbar-warning'] })
    );
    expect(transferServiceSpy.scheduleTransfer).not.toHaveBeenCalled();
  });

  it('should mark amount invalid when parse fails', () => {
    const parseSpy = vi.spyOn(component as unknown as { parseAmount: (value: string) => number | null }, 'parseAmount');
    parseSpy.mockReturnValue(null);

    component.form.setValue({
      sourceAccount: '1234567890',
      destinationAccount: '0987654321',
      amount: 10,
      transferDate: new Date('2026-04-01')
    });

    Object.values(component.form.controls).forEach((control) => control.setErrors(null));
    component.form.setErrors(null);

    component.submit();

    expect(component.form.get('amount')?.hasError('invalidAmount')).toBe(true);
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Informe um valor válido para a transferência.',
      'Fechar',
      expect.objectContaining({ panelClass: ['snackbar-warning'] })
    );
    expect(transferServiceSpy.scheduleTransfer).not.toHaveBeenCalled();
  });

  it('should schedule transfer when form is valid', () => {
    const parseSpy = vi.spyOn(component as unknown as { parseAmount: (value: string) => number | null }, 'parseAmount');
    parseSpy.mockReturnValue(1234.5);
    transferServiceSpy.scheduleTransfer.mockReturnValue(
      of({
        id: 1,
        fee: 1,
        schedulingDate: '2026-04-01',
        sourceAccount: '1234567890',
        destinationAccount: '0987654321',
        amount: 1234.5,
        transferDate: '2026-04-01'
      })
    );

    component.form.setValue({
      sourceAccount: '1234567890',
      destinationAccount: '0987654321',
      amount: 1234.5,
      transferDate: new Date('2026-04-01')
    });

    Object.values(component.form.controls).forEach((control) => control.setErrors(null));
    component.form.setErrors(null);

    component.submit();

    expect(transferServiceSpy.scheduleTransfer).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceAccount: '1234567890',
        destinationAccount: '0987654321',
        amount: 1234.5
      })
    );
    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Transferência agendada com sucesso.',
      'Fechar',
      expect.objectContaining({ panelClass: ['snackbar-success'] })
    );
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/list']);
    expect(component.form.value.sourceAccount).toBeNull();
    expect(component.loading).toBe(false);
  });

  it('should show error message when service fails', () => {
    const parseSpy = vi.spyOn(component as unknown as { parseAmount: (value: string) => number | null }, 'parseAmount');
    parseSpy.mockReturnValue(10);
    transferServiceSpy.scheduleTransfer.mockReturnValue(
      throwError(() => ({ error: { message: 'Falha no servidor' } }))
    );

    component.form.setValue({
      sourceAccount: '1234567890',
      destinationAccount: '0987654321',
      amount: 10,
      transferDate: new Date('2026-04-01')
    });

    Object.values(component.form.controls).forEach((control) => control.setErrors(null));
    component.form.setErrors(null);

    component.submit();

    expect(snackBarSpy.open).toHaveBeenCalledWith(
      'Falha no servidor',
      'Fechar',
      expect.objectContaining({ panelClass: ['snackbar-error'] })
    );
    expect(component.loading).toBe(false);
  });

  it('should format amount input on typing', () => {
    const input = document.createElement('input');
    input.value = '00012,345a';

    component.onAmountInput({ target: input } as unknown as Event);

    expect(input.value).toBe('12,34');
    expect(component.form.get('amount')?.value).toBe('12,34');
  });

  it('should format amount on blur', () => {
    component.form.get('amount')?.setValue('1234,5');

    component.formatAmount();

    expect(component.form.get('amount')?.value).toBe('1.234,50');
  });
});
