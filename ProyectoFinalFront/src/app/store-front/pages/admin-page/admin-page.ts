import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-admin-page',
  imports: [],
  templateUrl: './admin-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPage {
  readonly auth = inject(AuthService);
}