import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavBarComponent implements OnInit {
  auth: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchAuthStatus();
  }

  fetchAuthStatus(): void {
    try {
      const jwtToken = localStorage.getItem('jwtToken');
      this.auth = !!jwtToken;
    } catch (err) {
      console.log(err);
    }
  }

  handleLogout(): void {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
    this.auth = false;
  }
}
