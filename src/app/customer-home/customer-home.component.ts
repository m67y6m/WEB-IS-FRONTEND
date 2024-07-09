import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import moment from 'moment';

export interface Room {
  roomId: number;
  roomType: string;
  roomPrice: number;
  roomStatus: string;
  roomPicture: string;
}

export interface Package {
  packageId: number;
  packageType: string;
  packagePrice: number;
}

export interface Customer {
  customerId: number;
  customerName: string;
}

@Component({
  selector: 'app-room',
  templateUrl: './customer-home.component.html',
  styleUrls: ['./customer-home.component.css']
})
export class CustomerHomeComponent implements OnInit {
  customerHomeForm: FormGroup;
  rooms: Room[] = [];
  packages: Package[] = [];
  customers: Customer[] | undefined;
  selectedPackageId: number | undefined;
  baseUrl: string = 'http://localhost:8080/'; // Adjust the base URL as needed
  selectedRoomId: number | undefined; // Variable to store selected roomId

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.customerHomeForm = this.fb.group({
      roomId: [0, Validators.required],
      packageId: [0, Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      price: [0],
      customerId: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.customerHomeForm.patchValue({});
    this.fetchRooms();
    this.fetchPackages();
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.authService.getAllCustomers().subscribe(
      (customers: Customer[]) => {
        this.customers = customers;
      },
      (error: any) => {
        console.error('Error Fetching Customers', error);
      }
    );
  }

  fetchRooms() {
    this.authService.getAllRooms().subscribe(
      (rooms: Room[]) => {
        this.rooms = rooms;
      },
      (error: any) => {
        console.error('Error Fetching Rooms', error);
      }
    );
  }

  fetchPackages() {
    this.authService.getAllPackage().subscribe(
      (packages: Package[]) => {
        this.packages = packages;
      },
      (error: any) => {
        console.error('Error Fetching Packages', error);
      }
    );
  }

  addBookings(roomId: number) {
    const customerId = parseInt(localStorage.getItem('id')!, 10);
    this.selectedRoomId = roomId; // Store roomId in the class-level variable
    this.customerHomeForm.patchValue({
      roomId: roomId,
      customerId: customerId
    });
    console.log('You clicked the room with id:', roomId);
    console.log('And customer id is:', customerId);
  }

  check_in: any;
  check_out: any;

  onSubmit(): void {
    const customerId = parseInt(localStorage.getItem('id')!, 10);
    const customerData = {
      checkInDate: this.check_in,
      checkOutDate: this.check_out,
      customerId: customerId,
      packageId: this.selectedPackageId ? parseInt(this.selectedPackageId.toString(), 10) : undefined,
      roomId: this.selectedRoomId, // Use the stored roomId
      status: "",
      price: 0
    };
    console.log(customerData);

    if (customerId) {
      if (this.selectedPackageId) {
        customerData.packageId = parseInt(this.selectedPackageId.toString(), 10);

        console.log('Transformed data:', customerData);

        this.http.post(`${this.baseUrl}bookings/add`, customerData).subscribe(
          response => {
            console.log('Booking Added', response);
            Swal.fire({
              title: 'Booking Added Successfully',
              icon: 'success'
            });
          },
          error => {
            console.error('Error Adding Booking', error);
            Swal.fire({
              title: 'Error adding booking',
              icon: 'error'
            });
          }
        );
      } else {
        console.error('No package selected');
        Swal.fire({
          title: 'Error',
          text: 'No package selected. Please select a package.',
          icon: 'error'
        });
      }
    } else {
      console.error('Customer ID not found in localStorage');
      Swal.fire({
        title: 'Error',
        text: 'Customer ID not found. Please log in again.',
        icon: 'error'
      });
    }
  }
}
