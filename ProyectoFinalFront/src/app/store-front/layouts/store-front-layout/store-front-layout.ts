import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FrontNavbar } from '@store-front/components/front-navbar/front-navbar';


@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbar],
  templateUrl: './store-front-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreFrontLayout {}
