import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Bookings {
rooms: any;
  bookingId: number;
  checkInDate: Date;
  checkOutdate: Date;
  status: string;
  price: number;
}

export interface Customer{
  customerId: number;
  customerName: string;
}

export interface Rooms{
  roomId: number;
  roomType: string;
  roomPrice: number;
}

export interface Package{
  packageId: number;
  packageType: string;
  packagePrice: number;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  private baseUrl = 'http://localhost:8080';
  bookings: any[] = [];
  rooms: Rooms[] = [];
  packages: Package[] = [];
  customers: Customer[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchBookings();
    this.fetchRooms();
    this.fetchPackages();
    this.fetchCustomers();
  }

  fetchBookings() {
    this.http.get<Bookings[]>(`${this.baseUrl}/bookings/get`).subscribe(
      data => {
        console.log('Bookings fetched:', data); // Log fetched data
        this.bookings = data;
      },
      error => {
        console.error('Error fetching bookings:', error); // Log any errors
      }
    );
  }

  fetchRooms(){
    this.http.get<Rooms[]>(`${this.baseUrl}/rooms/get`).subscribe(
      dataRooms => {
        console.log('Rooms fetched:', dataRooms); // Log fetched data
        this.rooms = dataRooms;
      },
      error => {
        console.error('Error fetching rooms:', error); // Log any errors
      }
    );
  }

  fetchPackages(){
    this.http.get<Package[]>(`${this.baseUrl}/package/get`).subscribe(
      dataPackage => {
        console.log('Package fetched:', dataPackage); // Log fetched data
        this.packages = dataPackage;
      },
      error => {
        console.error('Error fetching packages:', error); // Log any errors
      }
    );
  }

  fetchCustomers(){
    this.http.get<Customer[]>(`${this.baseUrl}/customers/get`).subscribe(
      dataCustomers => {
        console.log('Customer fetched:', dataCustomers); // Log fetched data
        this.customers = dataCustomers;
      },
      error => {
        console.error('Error fetching customers:', error); // Log any errors
      }
    );
  }

}
