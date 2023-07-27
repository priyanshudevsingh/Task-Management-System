import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { backendUrl } from '../backendUrl';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    cpassword: '',
  };

  constructor(private http: HttpClient, private router: Router) {}

  async postData(): Promise<void> {
    try {
      const { name, email, password, cpassword } = this.user;

      const res = await this.http
        .post<any>(
          `${backendUrl}/register`,
          {
            name,
            email,
            password,
            cpassword,
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
      } else if (res.status === 422) {
        window.alert("You're missing some fields");
        console.log("You're missing some fields");
      } else if (res.status === 409) {
        window.alert('Email already Exists');
        console.log('Email already Exists');
      } else if (res.status === 406) {
        window.alert('This UserID is not available');
        console.log('This UserID is not available');
      } else if (res.status === 400) {
        window.alert('Passwords are not matching');
        console.log('Passwords are not matching');
      } else {
        window.alert('Registration Successful');
        console.log('Registration Successful');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
