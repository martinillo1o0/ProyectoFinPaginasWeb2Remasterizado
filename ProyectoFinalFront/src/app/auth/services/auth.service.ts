import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { User } from '@auth/interfaces/user.interface';
import { environment } from 'src/environments/environment.development';

export interface AuthResponse extends User { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'marti-music-session';
  readonly currentUser = signal<User | null>(this.readSession()?.user ?? null);
  readonly token = signal<string | null>(this.readSession()?.token ?? null);
  readonly isAuthenticated = computed(() => !!this.token());

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/auth/login`, { email, password }).pipe(tap((response) => this.setSession(response)));
  }

  register(email: string, password: string, fullName: string) {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/auth/register`, { email, password, fullName }).pipe(tap((response) => this.setSession(response)));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
    this.token.set(null);
  }

  hasRole(role: string): boolean { return this.currentUser()?.roles.includes(role) ?? false; }

  private setSession(response: AuthResponse): void {
    const { token, ...user } = response;
    localStorage.setItem(this.storageKey, JSON.stringify({ token, user }));
    this.currentUser.set(user);
    this.token.set(token);
  }

  private readSession(): { token: string; user: User } | null {
    try { return JSON.parse(localStorage.getItem(this.storageKey) ?? 'null') as { token: string; user: User } | null; }
    catch { return null; }
  }
}
