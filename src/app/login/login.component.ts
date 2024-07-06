// src/app/login/login.component.ts

import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { response } from 'express';
import { error } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginModel: any = {}
  customerLogInModel: any = {}
  passwordFieldType: string = 'password';
  password: string = '';

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService, 
    private router: Router) {}

  onSignIn(event: Event) {
    this.authService.logIn(this.loginModel).subscribe
    (
      (response: any) => {
        console.log ('Admin SignIn Successful', response);
        const role = response.role;
        const name = response.name;
        if(response.message === 'SignIn Successfull') {
          this.router.navigate(['/dashboard']);
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "SignIn successfully"
          });
        }
      },
      (error: any) => {
        console.error('SignIn Failed', error);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Incorrect Email Or Password"
        });
      }
    )

    this.authService.customerLogIn(this.customerLogInModel).subscribe
    (
      (response: any) => {
        console.log ('Customer SignIn Successful', response);
        const role = response.role;
        const name = response.name;
        if(response.message === 'SignIn Successfully') {
          this.router.navigate(['/customerHome']);
          localStorage.setItem('id', response.id);
        }
      },
      (error: any) => {
        console.error('SignIn Failed', error);
      }
    )
    // Your authentication logic here
    // this.router.navigate(['/dashboard']);
  }

  onSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
