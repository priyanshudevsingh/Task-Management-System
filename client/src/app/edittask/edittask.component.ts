import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { backendUrl } from '../burl';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface UserData {
  email: string;
}

@Component({
  selector: 'app-edittask',
  templateUrl: './edittask.component.html',
  styleUrls: ['./edittask.component.css'],
})
export class EdittaskComponent implements OnInit {
  taskId: string | null = null;
  userEmail: string | null = null;
  title: string = '';
  description: string = '';
  priority: string = '';
  status: string = '';
  duedateDay: string = '';
  duedateMonth: string = '';
  duedateYear: string = '';
  duedate: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserData();
  }

  // to extract current logged in user's email
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
          this.taskId = this.route.snapshot.paramMap.get('taskId');
          this.callTasks(this.taskId, this.userEmail);
        }
      });
  }

  // on clicking edit task following func triggers and send req to backend to edit task
  editTask(): void {
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

    const url = `${backendUrl}/edit/${this.taskId}?email=${encodeURIComponent(
      this.userEmail || ''
    )}`;

    this.http
      .patch<any>(
        url,
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
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          alert('Task Edited successfully');
          console.log('Task Edited successfully');
          this.router.navigate(['mytasks']);
        } else {
          alert('Failed to Edit task.');
          console.log('Failed to Edit task.');
        }
      });
  }

  // getting task details for autofill with current details
  callTasks(taskId: string | null, email: string): void {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken') || '',
    });

    const options = { headers, withCredentials: true };

    const url = `${backendUrl}/viewtask/${taskId}?email=${encodeURIComponent(
      email
    )}`;

    this.http
      .get<any>(url, options)
      .pipe(
        catchError((error) => {
          console.log(error);
          this.router.navigate(['/login']);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          console.log(data);
          this.title = data.title || '';
          this.description = data.description || '';
          this.priority = data.priority || '';
          this.status = data.status || '';

          if (data.duedate) {
            const [day, month, year] = data.duedate.split('-');
            this.duedateDay = day || '';
            this.duedateMonth = month || '';
            this.duedateYear = year || '';
          }
        }
      });
  }
}
