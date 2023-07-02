import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router) {}

  setToken(token: string): void {
    let expirationDate = new Date(new Date().getTime() + (10000 * 10))
    let newValue = {
    value: token,
    expirationDate: expirationDate.toISOString()
  }
    sessionStorage.setItem('token', JSON.stringify(newValue));
  }

  setDataUser(nameUser: string){
    sessionStorage.setItem('dataUser', nameUser);
  }

  getToken(): string | null {
    let stringValue = sessionStorage.getItem('token')
    if (stringValue !== null) {
      let value = JSON.parse(stringValue)
        let expirationDate = new Date(value.expirationDate)
        if (expirationDate > new Date()) {
          return value.value
        } else {
          sessionStorage.removeItem('token')
        }
    }
    this.router.navigate(['/login']);
    return null;
  }

  isLoggedIn() {
    return this.getToken() !== null;
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('dataUser');
    this.router.navigate(['/login']);
  }

  login({ email, password }: any): Observable<any> {
    if (email === 'admin@gmail.com' && password === 'admin123') {
      this.setToken('abcdefghijklmnopqrstuvwxyz');
      this.setDataUser('Admin System');
      this.getLoggedInName.emit('Admin System');
      return of({ name: 'Admin System', email: 'admin@gmail.com' });
    }
    return throwError(() => new Error('Failed to login'));
  }
}
