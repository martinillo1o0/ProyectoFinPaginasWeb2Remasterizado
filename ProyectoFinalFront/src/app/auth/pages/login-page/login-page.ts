import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth/services/auth.service';

@Component({ selector: 'app-login-page', imports: [ReactiveFormsModule, RouterLink], templateUrl: './login-page.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly returnUrl = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('returnUrl') ?? '/')), { initialValue: '/' });
  readonly submitting = signal(false);
  readonly errorMessage = signal('');
  readonly form = this.formBuilder.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(6)]] });

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true); this.errorMessage.set('');
    this.auth.login(this.form.getRawValue().email, this.form.getRawValue().password).subscribe({ next: () => this.router.navigateByUrl(this.returnUrl()), error: (error) => { this.errorMessage.set(error.error?.message ?? 'No se pudo iniciar sesión.'); this.submitting.set(false); } });
  }
}
