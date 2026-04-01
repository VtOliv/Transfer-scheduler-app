import { Component, inject, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TransferService, Transfer } from '../../services/transfer-service';

@Component({
  selector: 'app-transfer-list',
  imports: [MatCardModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './transfer-list.html',
  styleUrl: './transfer-list.css',
})
export class TransferList implements OnInit {
  private readonly transferService = inject(TransferService);

  readonly dataSource = new MatTableDataSource<Transfer>([]);
  readonly displayedColumns: string[] = [
    'id',
    'sourceAccount',
    'destinationAccount',
    'amount',
    'fee',
    'schedulingDate',
    'transferDate'
  ];

  ngOnInit() {
    this.transferService.getTransfers().subscribe({
      next: (data) => {
        this.dataSource.data = data ?? [];
        console.log('Transferências carregadas:', this.dataSource.data);
      },
      error: (err) => console.error('Erro ao buscar transferências:', err)
    });
  }

}
