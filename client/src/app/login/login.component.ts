import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from '../burl';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // sending login data to backend
  postData(): void {
    if (!this.email || !this.password) {
      window.alert("You're missing some fields");
      console.log("You're missing some fields");
      return;
    }

    this.http
      .post<any>(
        `${backendUrl}/login`,
        {
          email: this.email,
          password: this.password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          if (error.status === 422) {
            alert("You're missing some fields");
          } else if (error.status === 400) {
            alert('Invalid Credentials');
          }
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          localStorage.setItem('jwtToken', res.token);
          alert('Login Successful');
          console.log('Login Successful');
          window.location.href = 'home';
        }
      });
  }
}
