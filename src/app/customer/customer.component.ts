import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

export interface Customer {
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: number;
  customerNationality: string;
  customerStatus: string;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customers: Customer[] = [];

  constructor(private authServices: AuthService, private fb: FormBuilder) {
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', Validators.required],
      customerNationality: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.authServices.getAllCustomers().subscribe(
      (customers: Customer[]) => {
        this.customers = customers;
      },
      (error: any) => {
        console.error('Error Fetching Customers', error);
      }
    );
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;

      this.authServices.addCustomer(customerData).subscribe(
        response => {
          console.log('Customer Added Successfully', response);
          Swal.fire({
            title: 'Customer Added Successfully',
            icon: 'success'
          });
          this.customerForm.reset();
          this.fetchCustomers();
        },
        error => {
          console.error('Error Adding Customer', error);
          Swal.fire({
            title: 'Customer Email Already Exist',
            icon: 'warning'
          });
        }
      );
    }
  }

  toggleCustomerStatus(customer: Customer) {
    // Implement the logic to toggle customer status
  }

  confirmDelete(customerId: number) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteCustomer(customerId);
      }
    });
  }

  deleteCustomer(customerId: number) {
    this.authServices.deleteCustomer(customerId).subscribe(
      response => {
        Swal.fire({
          title: 'Deleted',
          icon: 'success'
        });
        this.fetchCustomers();
      },
      error => {
        console.error('Error Deleting Customer', error);
        Swal.fire({
          title: 'Error',
          icon: 'error'
        });
      }
    );
  }
}
