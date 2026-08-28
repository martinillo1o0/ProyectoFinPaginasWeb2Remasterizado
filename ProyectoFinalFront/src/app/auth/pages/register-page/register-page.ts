import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

function strongPassword(control: AbstractControl): ValidationErrors | null { return /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(control.value as string) ? null : { weakPassword: true }; }
@Component({ selector: 'app-register-page', imports: [ReactiveFormsModule, RouterLink], templateUrl: './register-page.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder); private readonly auth = inject(AuthService); private readonly router = inject(Router);
  readonly submitting = signal(false); readonly errorMessage = signal('');
  readonly form = this.formBuilder.nonNullable.group({ fullName: ['', [Validators.required, Validators.minLength(1)]], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50), strongPassword]] });
  submit(): void { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.submitting.set(true); this.errorMessage.set(''); const value = this.form.getRawValue(); this.auth.register(value.email, value.password, value.fullName).subscribe({ next: () => this.router.navigateByUrl('/'), error: (error) => { this.errorMessage.set(error.error?.message ?? 'No se pudo crear la cuenta.'); this.submitting.set(false); } }); }
}
