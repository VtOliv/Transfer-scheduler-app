import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  menuOpen = false;
  protected readonly title = signal('transfer-scheduler-app');
}
