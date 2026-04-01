import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TransferService } from '../../services/transfer-service';



@Component({
  selector: 'app-transfer-form',
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule],
  templateUrl: './transfer-form.html',
  styleUrl: './transfer-form.css',
})
export class TransferForm {
  private fb = inject(FormBuilder);
  private transferService = inject(TransferService);
  private router = inject(Router);
  private readonly brFormatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  form: FormGroup = this.fb.group({
    sourceAccount: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    destinationAccount: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    amount: [null, Validators.required],
    transferDate: [null, Validators.required]
  });
  minDate: Date = new Date();

  formatAmount(): void {
    const control = this.form.get('amount');
    if (!control) {
      return;
    }

    const parsed = this.parseAmount(String(control.value ?? ''));
    if (parsed === null) {
      control.setErrors({ ...(control.errors ?? {}), invalidAmount: true });
      return;
    }

    control.setErrors(null);
    control.setValue(this.brFormatter.format(parsed), { emitEvent: false });
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const control = this.form.get('amount');
    if (!input || !control) {
      return;
    }

    const formatted = this.formatAmountInput(input.value);
    input.value = formatted;
    control.setValue(formatted, { emitEvent: false });
  }

  submit() {
    if (this.form.valid) {
      const amountParsed = this.parseAmount(String(this.form.value.amount ?? ''));
      if (amountParsed === null) {
        this.form.get('amount')?.setErrors({ invalidAmount: true });
        this.form.markAllAsTouched();
        return;
      }

      const payload = {
        ...this.form.value,
        amount: amountParsed
      };
      this.transferService.scheduleTransfer(payload).subscribe(() => {
        this.router.navigate(['/list']);
      });
    }
  }

  private parseAmount(value: string): number | null {
    const sanitized = value.replace(/[^0-9,.-]/g, '');
    if (!sanitized) {
      return null;
    }

    let normalized = sanitized;
    if (normalized.includes(',')) {
      normalized = normalized.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = normalized.replace(/,/g, '');
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private formatAmountInput(value: string): string {
    const cleaned = value.replace(/[^0-9,]/g, '');
    if (!cleaned) {
      return '';
    }

    const parts = cleaned.split(',');
    const integerPart = parts[0].replace(/^0+(?=\d)/, '');
    const hasComma = cleaned.includes(',');
    const decimalPart = parts[1] ?? '';
    const limitedDecimal = decimalPart.slice(0, 2);

    if (hasComma) {
      const safeInteger = integerPart || '0';
      return `${safeInteger},${limitedDecimal}`;
    }

    return integerPart;
  }
}
