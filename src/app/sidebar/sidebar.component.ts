import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // Note: Corrected from styleUrl to styleUrls
})
export class SidebarComponent implements OnInit {

  userRole: string | null = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
      this.userRole = localStorage.getItem('role');
    }

    console.log('User Role:', this.userRole);

    if (!this.userRole) {
      this.userRole = 'unknown';
    }
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
      this.router.navigate(['/login']);
    }, (error: any) => {
      console.error('Failed to Logout', error);
    });
  }

}
