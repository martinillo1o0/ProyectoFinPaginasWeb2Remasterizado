import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { PlaylistService } from '@playlist/services/playlist.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './front-navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrontNavbar {
  readonly auth = inject(AuthService);
  readonly playlist = inject(PlaylistService);
}
