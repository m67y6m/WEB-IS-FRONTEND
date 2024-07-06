import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { error } from 'console';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  userRole: string | null = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role');

    console.log('User Role:', this.userRole);

    if (!this.userRole) {

      this.userRole = 'customer';
    }

  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      // localStorage.removeItem('token');
      localStorage.removeItem('role');
      this.router.navigate(['/login'])
        this.router.navigate(['/login']);
    }, (error: any) => {
      console.error('Failed to Logout', error);
    });
  }

}
