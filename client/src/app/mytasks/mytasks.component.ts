import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  // For sorting the task list
  sortOptions = [
    { label: 'Priority', value: 'priority' },
    { label: 'Status', value: 'status' },
    { label: 'Due Date', value: 'duedate' },
  ];

  selectedSortOption: string = '';

  onSortBy(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedSortOption = selectedValue;
    this.sortTasks();
  }

  sortTasks(): void {
    if (this.task) {
      this.task.sort((a, b) => {
        switch (this.selectedSortOption) {
          case 'priority':
            return this.comparePriority(a.priority, b.priority);
          case 'status':
            return this.compareStatus(a.status, b.status);
          case 'duedate':
            return this.compareDueDate(a.duedate, b.duedate);
          default:
            return 0;
        }
      });
    }
  }

  // function to compare priority
  comparePriority(priorityA: string, priorityB: string): number {
    const priorityOrder: { [key: string]: number } = {
      High: 1,
      Medium: 2,
      Low: 3,
    };
    return priorityOrder[priorityA] - priorityOrder[priorityB];
  }

  // function to compare status
  compareStatus(statusA: string, statusB: string): number {
    const statusOrder: { [key: string]: number } = {
      'To-Do': 1,
      'In-Progress': 2,
      Completed: 3,
    };
    return statusOrder[statusA] - statusOrder[statusB];
  }

  // function to compare due dates
  compareDueDate(dateA: string, dateB: string): number {
    const dateAComponents = dateA.split('-').map(Number);
    const dateBComponents = dateB.split('-').map(Number);

    for (let i = 2; i >= 0; i--) {
      if (dateAComponents[i] < dateBComponents[i]) return -1;
      if (dateAComponents[i] > dateBComponents[i]) return 1;
    }

    return 0;
  }

  // time date formatting
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

  // for exporting tasks in .csv file
  generateCSV(): string {
    let csv = 'Title, Description, Due Date, Priority, Status, Created At\n';
    if (this.task) {
      this.task.forEach((task) => {
        csv += `"${task.title}","${task.description}","${task.duedate}","${task.priority}","${task.status}","${this.calDateTime(task.createdAt)}"\n`;
      });
    }
    return csv;
  }

  generateDownloadLink(): string {
    const csvData = this.generateCSV();
    const blob = new Blob([csvData], { type: 'csv' });
    return URL.createObjectURL(blob);
  }
}
