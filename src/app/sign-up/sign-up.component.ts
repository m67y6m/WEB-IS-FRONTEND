// src/app/sign-up/sign-up.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  constructor(private router: Router) {}

  onSignUp() {
    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
    } else {
      this.passwordMismatch = false;
      // Your sign-up logic here
      this.router.navigate(['/login']);
    }
  }

  navigateToSignIn() {
    this.router.navigate(['/login']);
  }
}
