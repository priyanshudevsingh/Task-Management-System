import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { backendUrl } from '../backendUrl';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface UserData {
  email: string;
}

@Component({
  selector: 'app-addtask',
  templateUrl: './addtask.component.html',
  styleUrls: ['./addtask.component.css'],
})
export class AddtaskComponent {
  userEmail: string | null = null;
  title: string = '';
  description: string = '';
  priority: string = '';
  status: string = '';
  duedateDay: string = '';
  duedateMonth: string = '';
  duedateYear: string = '';
  duedate: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  // for getting current logged user's email
  fetchUserData(): void {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken') || '',
    });

    const options = { headers, withCredentials: true };

    this.http
      .get<UserData>(`${backendUrl}/userdata`, options)
      .pipe(
        catchError((error) => {
          console.log(error);
          this.router.navigate(['/login']);
          return of(null);
        })
      )
      .subscribe((userData: UserData | null) => {
        if (userData) {
          this.userEmail = userData.email;
          // this.addTask(this.userEmail);
        }
      });
  }

  // for adding task
  addTask(): void {
    if (!this.duedateDay || !this.duedateMonth || !this.duedateYear) {
      window.alert("You're missing the Due Date");
      console.log("You're missing the Due Date");
      return;
    }

    this.duedate = `${this.duedateDay}-${this.duedateMonth}-${this.duedateYear}`;

    if (
      !this.title ||
      !this.description ||
      !this.duedate ||
      !this.priority ||
      !this.status
    ) {
      window.alert("You're missing some fields");
      console.log("You're missing some fields");
      return;
    }

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken') || '',
    });

    const options = { headers, withCredentials: true };

    this.http
      .post<any>(
        `${backendUrl}/addtask?email=${encodeURIComponent(
          this.userEmail || ''
        )}`,
        {
          title: this.title,
          description: this.description,
          duedate: this.duedate,
          priority: this.priority,
          status: this.status,
        },
        options
      )
      .pipe(
        catchError((error) => {
          console.log(error);
          if (error.status === 422) {
            alert("You're missing some fields");
          }
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          alert('Task Added Successfully');
          console.log('Task Added Successfully');
          this.router.navigate(['mytasks']);
        }
      });
  }
}
