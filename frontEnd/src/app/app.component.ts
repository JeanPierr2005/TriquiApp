import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BotonsComponent } from './components/botons/botons.component';
import { ServerService } from './services/server.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BotonsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Triqui';

  serverService = inject(ServerService)
}
