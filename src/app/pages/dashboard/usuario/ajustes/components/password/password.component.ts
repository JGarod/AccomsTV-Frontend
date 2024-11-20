import { Component, Input } from '@angular/core';
import { ConfigUserData } from '../../../../../../interfeces/config-user/config-user.interface';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  @Input() usuarioActual!: ConfigUserData | null;

}
