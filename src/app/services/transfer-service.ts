import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TransferDto {
  sourceAccount: string;
  destinationAccount: string;
  amount: number;
  transferDate: string;
}

export interface Transfer extends TransferDto {
  id: number;
  fee: number;
  schedulingDate: string;
}

@Injectable({ providedIn: 'root' })
export class TransferService {
  private baseUrl = 'http://localhost:8097/transfers';

  constructor(private http: HttpClient) { }

  scheduleTransfer(dto: TransferDto): Observable<Transfer> {
    return this.http.post<Transfer>(this.baseUrl, dto);
  }

  getTransfers(): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(this.baseUrl);
  }
}