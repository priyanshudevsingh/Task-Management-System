import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from '../backendUrl';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  async postData(): Promise<void> {
    try {
      if (!this.email || !this.password) {
        window.alert("You're missing some fields");
        console.log("You're missing some fields");
        return;
      }

      const res = await this.http
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
        .toPromise();

      if (!res) {
        window.alert("You're missing some fields");
        console.log("You're missing some fields");
      } else if (res.status === 400) {
        window.alert('Invalid Credentials');
        console.log('Invalid Credentials');
      } else {
        localStorage.setItem('jwtToken', res.token);
        window.alert('Login Successful');
        console.log('Login Successful');
        this.router.navigate(['/']);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
