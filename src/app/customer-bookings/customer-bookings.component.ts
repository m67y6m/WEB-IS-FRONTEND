import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';

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
}
