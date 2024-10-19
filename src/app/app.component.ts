import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet></router-outlet>`, // Aquí está el router outlet
  imports: [RouterOutlet], // Solo importa RouterOutlet aquí
  styleUrls: ['./app.component.css']
})
export class AppComponent {}

