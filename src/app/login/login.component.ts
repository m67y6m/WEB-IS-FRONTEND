// src/app/login/login.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  passwordFieldType: string = 'password';
  password: string = '';

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  constructor(private router: Router) {}

  onSignIn(event: Event) {
    event.preventDefault(); 
    // Your authentication logic here
    this.router.navigate(['/dashboard']);
  }

  onSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
