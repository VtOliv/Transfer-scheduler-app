import { Routes } from '@angular/router';
import { TransferForm } from './components/transfer-form/transfer-form';
import { TransferList } from './components/transfer-list/transfer-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'form' },
  { path: 'form', component: TransferForm },
  { path: 'list', component: TransferList },
  { path: '**', redirectTo: 'form' }
];