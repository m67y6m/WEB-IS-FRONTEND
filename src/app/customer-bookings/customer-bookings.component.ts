import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

export interface Bookings {
  rooms: any;
  bookingId: number;
  checkInDate: Date;
  checkOutdate: Date;
  status: string;
  price: number;
  packages: any;
}

export interface Rooms {
  roomId: number;
  roomType: string;
  roomPrice: number;
}

export interface Package{
  packageType: string;
  packagePrice: number;
}

export interface Customer {
  customerId: number;
  customerName: string;
}

@Component({
  selector: 'app-customer-bookings',
  templateUrl: './customer-bookings.component.html',
  styleUrls: ['./customer-bookings.component.css']
})
export class CustomerBookingsComponent implements OnInit {
  packages: Package[] = [];
  rooms: Rooms[] = [];
  customers: Customer[] = [];
  loginCustomerBookings: any[] = [];
  baseUrl: any;
  bookings: any;
  
  constructor(
    private authService: AuthService, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCustomerBookings();
    }
  }

  loadCustomerBookings(): void {
    const customerId = localStorage.getItem('id');
    console.log('Retrieve customerId from localstorage:', customerId);
    if (customerId) {
        this.http.get<any[]>(`${this.authService.baseUrl}/bookings/getByCustomerId/${customerId}`).subscribe(bookings => {
              console.log('Bookings Fetched from API:', bookings);
                this.loginCustomerBookings = bookings;
            }, error => {
                console.error('Error fetching bookings:', error);
            });
    } else {
      console.error('Customer ID not found in localStorage')
    }
  }


  cancelBooking(bookingId: number) {
    const url = `${this.authService.baseUrl}/bookings/cancel/${bookingId}`; // Use the correct endpoint
    this.http.put(url, {}, { responseType: 'text' }).subscribe(
      response => {
        console.log('Booking cancelled:', response);
        Swal.fire({
          icon: "error",
          title: "Booking Cancelled",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        // Update the booking status locally
        const booking = this.loginCustomerBookings.find((b: { bookingId: number; }) => b.bookingId === bookingId);
        if (booking) {
          booking.status = 'CANCELLED';
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error cancelling booking:', error);
        Swal.fire({
          icon: "error",
          title: "Error Cancelling Booking",
          text: error.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    );
  }

  makePayment(bookingId: number) {
    const url = `${this.authService.baseUrl}/bookings/pay/${bookingId}`; // Use the correct endpoint
    this.http.put(url, {}, { responseType: 'text' }).subscribe(
      response => {
        console.log('Payment Sucessful:', response);
        Swal.fire({
          icon: "success",
          title: "Payment Done",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        // Update the booking status locally
        const booking = this.loginCustomerBookings.find((b: { bookingId: number; }) => b.bookingId === bookingId);
        if (booking) {
          booking.status = 'PAID';
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Error Making Payment:', error);
        Swal.fire({
          icon: "error",
          title: "Error Making Payment",
          text: error.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
      }
    );
  }
  

}
