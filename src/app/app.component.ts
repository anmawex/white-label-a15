import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsPanelComponent } from './features/settings/settings-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, SettingsPanelComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pro-app';
}
