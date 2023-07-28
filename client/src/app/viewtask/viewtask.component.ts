import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { backendUrl } from '../backendUrl';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Task {
  taskid: string;
  title: string;
  description: string;
  duedate: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface UserData {
  email: string;
}

interface Hist {
  title_prev: string;
  description_prev: string;
  duedate_prev: string;
  priority_prev: string;
  status_prev: string;
  title_now: string;
  description_now: string;
  duedate_now: string;
  priority_now: string;
  status_now: string;
  updatedAt: string;
}

@Component({
  selector: 'app-viewtask',
  templateUrl: './viewtask.component.html',
  styleUrls: ['./viewtask.component.css'],
})
export class ViewtaskComponent implements OnInit {
  task: Task | null = null;
  userEmail: string | null = null;
  hist: Hist[] | null = null;
  taskId: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  taskBoxWidth = 'auto';
  taskBoxHeight = 'auto';

  @ViewChild('taskBox') taskBoxRef!: ElementRef;

  ngOnInit(): void {
    this.fetchUserData();
    this.calculateTaskBoxSize();
  }

  // content size detertminer for css start
  private calculateTaskBoxSize(): void {
    if (this.taskBoxRef && this.taskBoxRef.nativeElement) {
      const nativeElement = this.taskBoxRef.nativeElement as HTMLElement;
      this.taskBoxWidth = nativeElement.scrollWidth + 'px';
      this.taskBoxHeight = nativeElement.scrollHeight + 'px';
    }
  }

  onContentChange(): void {
    this.calculateTaskBoxSize();
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'Low':
        return 'priority-low';
      case 'Medium':
        return 'priority-medium';
      case 'High':
        return 'priority-high';
      default:
        return '';
    }
  }
  // content size detertminer for css end

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
          this.viewHistory(this.taskId, this.userEmail);
        }
      });
  }

  // getting task details
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
      .subscribe((data: Task | null) => {
        this.task = data;
        console.log(data);
      });
  }

  // time date formatting start
  calAgoTime(createdAt: string): string {
    const currentTime = Date.now();
    const givenTime = new Date(createdAt).getTime();
    const timeDifference = currentTime - givenTime;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    let agoMessage = '';

    if (days > 0) {
      agoMessage = `${days} day(s) ago`;
    } else if (hours > 0) {
      agoMessage = `${hours} hour(s) ago`;
    } else if (minutes > 0) {
      agoMessage = `${minutes} minute(s) ago`;
    } else {
      agoMessage = `${seconds} second(s) ago`;
    }

    return agoMessage;
  }

  calDateTime(createdAt: string): string {
    const dateTime = new Date(createdAt);

    const day = String(dateTime.getDate()).padStart(2, '0');
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const year = dateTime.getFullYear();

    const hours = String(dateTime.getHours()).padStart(2, '0');
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year} at ${hours}:${minutes}`;

    return formattedDate;
  }
  // time date formatting end

  // getting history of a particular task
  viewHistory(taskId: string | null, email: string): void {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken') || '',
    });

    const options = { headers, withCredentials: true };

    const url = `${backendUrl}/viewhistory/${taskId}?email=${encodeURIComponent(
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
      .subscribe((data: Hist[] | null) => {
        this.hist = data;
        console.log(data);
      });
  }

  // going to edit task page
  editTask(): void {
    this.router.navigate([`/edit/${this.taskId}`]);
  }

  // deleteing task
  deleteTask(): void {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('jwtToken') || '',
    });

    const options = { headers, withCredentials: true };

    const url = `${backendUrl}/delete/${this.taskId}?email=${encodeURIComponent(
      this.userEmail || ''
    )}`;

    console.log(this.userEmail);
    console.log(this.taskId);

    this.http
      .delete<any>(url, options)
      .pipe(
        catchError((error) => {
          console.log(error);
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          alert('Task deleted successfully');
          console.log('Task deleted successfully');
          this.router.navigate(['mytasks']);
        } else {
          alert('Failed to delete task.');
          console.log('Failed to delete task.');
        }
      });
  }
}
