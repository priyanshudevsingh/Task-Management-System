import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from '../burl';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  cpassword: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // sending register data to backend
  postData(): void {
    if (!this.name || !this.email || !this.password || !this.cpassword) {
      window.alert("You're missing some fields");
      console.log("You're missing some fields");
      return;
    }

    this.http
      .post<any>(
        `${backendUrl}/register`,
        {
          name: this.name,
          email: this.email,
          password: this.password,
          cpassword: this.cpassword,
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
          } else if (error.status === 409) {
            alert('Email already Exists');
          } else if (error.status === 400) {
            alert('Passwords are not matching');
          }
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          alert('Registration Successful');
          console.log('Registration Successful');
          this.router.navigate(['/login']);
        }
      });
  }
}
