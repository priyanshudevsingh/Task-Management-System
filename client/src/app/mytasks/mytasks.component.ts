import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { backendUrl } from '../backendUrl';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Task {
  taskid: string;
  title: string;
  duedate: string;
  priority: string;
  status: string;
}

interface UserData {
  email: string;
}

@Component({
  selector: 'app-mytasks',
  templateUrl: './mytasks.component.html',
  styleUrls: ['./mytasks.component.css'],
})
export class MytasksComponent implements OnInit {
  task: Task[] | null = null;
  userEmail: string | null = null;

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
          this.callTasks(this.userEmail);
        }
      });
  }

  // sending req to backend to get task list
  callTasks(email: string): void {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken') || '',
    });

    const options = { headers, withCredentials: true };

    const url = `${backendUrl}/mytasks?email=${encodeURIComponent(email)}`;

    this.http
      .get<any>(url, options)
      .pipe(
        catchError((error) => {
          console.log(error);
          this.router.navigate(['/login']);
          return of(null);
        })
      )
      .subscribe((data: Task[] | null) => {
        this.task = data;
        console.log(data);
      });
  }
}
