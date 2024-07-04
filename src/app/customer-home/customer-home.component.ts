import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { error } from 'console';
import { response } from 'express';
import Swal from 'sweetalert2';

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

export interface Customer{
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

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.customerHomeForm = this.fb.group({
      customerName: ['', Validators.required],
      roomType: ['', Validators.required],
      packageType: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
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

  onSubmit(): void {
    if (this.customerHomeForm.valid) {
      const customerData = this.customerHomeForm.value;

      this.authService.addBooking(customerData).subscribe(
        response => {
          console.log('Booking Added Sucessfully', response);
          Swal.fire({
            title: 'Customer Added Sucessfully',
            icon: 'success'
          });
        }
      )
    }
  }

}
