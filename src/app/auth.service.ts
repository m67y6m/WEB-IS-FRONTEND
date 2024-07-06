import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Room } from './room/room.component';
import { Customer } from './customer/customer.component';
import { Package } from './package/package.component';
import { BookingComponent, Bookings } from './booking/booking.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { response } from 'express';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  public baseUrl = 'http://localhost:8080';
  private isLoggedInStatus = false;

  constructor(private http: HttpClient) { }
  
  logIn (admin: any): Observable<any> {

    return this.http.post<any>(`${this.baseUrl}/authentication/signIn`, admin).pipe(
      tap(response => {
        if (response.message ===  'SignIn Successfull') {
          localStorage.setItem('role', response.role);
            this.isLoggedInStatus = true;
        }
      }),
      catchError((error: HttpErrorResponse)=> {
        console.error('Signing In Error', error);
        return throwError (() => new Error(error.error.message || 'SignIn Failed'))
      })
    ); 
  }

  customerLogIn (customer: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/customers/customerLogIn`, customer).pipe(
      tap(response => {
        if (response.message ===  'SignIn Successfully') {
          localStorage.setItem('role', response.role);
          localStorage.setItem('id', response.id);
            this.isLoggedInStatus = true;
        }
      }),
      catchError((error: HttpErrorResponse)=> {
        console.error('Signing In Error', error);
        return throwError (() => new Error(error.error.message || 'Incorrect Email Or Password'))
      })
    ); 
  }
  


  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/logout`, {}).pipe(

      tap(() => {
        this.isLoggedInStatus = false;
      })
    );
  }

  checkSession(): Observable<any> {
    return this.http.get<any> (`${this.baseUrl}/authentication/checkSession`).pipe(
      tap(response => {
        this.isLoggedInStatus = response.message === 'User Is Logged In';
      }),
      catchError((error: HttpErrorResponse) => {
        this.isLoggedInStatus = false;
        return throwError (() => new Error(error.error.message || 'Session Failed' ));
      })

    );
  }

  isLoggedIn(): boolean {
    return this.isLoggedInStatus;
  }

  getBookingsByCustomerId(customerId: number): Observable<Bookings[]> {
    return this.http.get<Bookings[]>(`${this.baseUrl}/bookings/getByCustomerId/${customerId}`);
  }

  addRoom(room: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/rooms/add`, room);
  }

  getAllRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/rooms/get`);
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete<Room[]>(`${this.baseUrl}/rooms/delete/${roomId}`);
  }

  addBooking(booking: any): Observable<any>  {
    return this.http.post(`${this.baseUrl}/bookings/add`, booking);
  }

  getAllBookings(): Observable<Bookings[]> {
    return this.http.get<Bookings[]>(`${this.baseUrl}/bookings/get`);
  }

  addCustomer(customer: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers/add`, customer);
  }

  registerCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customers/register`, customer);
  }

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/customers/get`);
  }

  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete<Customer[]>(`${this.baseUrl}/customers/delete/${customerId}`);
  }

  addPackage(packages: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/package/add`, packages);
  }

  getAllPackage(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.baseUrl}/package/get`);
  }

  deletePackage(packageId: number): Observable<any> {
    return this.http.delete<Package[]>(`${this.baseUrl}/package/delete/${packageId}`);
  }

  // addBooking(bookings: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/bookings/add`, bookings)
  // }

  

  // deleteBooking(bookingId: number): Observable<any> {
  //   return this.http.delete<Booking[]>(`${this.baseUrl}/booking/delete/${bookingId}`);
  // }
}
