import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import { error } from 'console';
import { response } from 'express';

export interface Package {
  packageId: number;
  packageType: string;
  packagePrice: number;
  
}

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrl: './package.component.css'
})
export class PackageComponent implements OnInit{
  packageForm: FormGroup;
  package: Package[] = [];

  constructor(private authServices: AuthService, private fb: FormBuilder) {
    this.packageForm = this.fb.group({
      packageType: ['', Validators.required],
      packagePrice: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchPackage();
  }

  fetchPackage() {
    this.authServices.getAllPackage().subscribe(
      (packages: Package[]) => {
        this.package = packages;
      },
      (error: any) => {
        console.error('Error Fetching Packages', error);
      }
    );
  }

  onSubmit(): void {
    if (this.packageForm.valid) {
      const packageData = this.packageForm.value;

      this.authServices.addPackage(packageData).subscribe(
        response => {
          console.log('Package Added Successfully', response);
          Swal.fire({
            title: 'Package Added Successfully',
            icon: 'success'
          });
          this.packageForm.reset();
          this.fetchPackage();
        },
        error => {
          console.error('Error Adding Package', error);
          Swal.fire({
            title: 'Error Adding Package',
            icon: 'warning'
          });
        }
      );
    }
  }

  confirmDelete(packageId: number) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.isConfirmed) {
        this.deletePackage(packageId);
      }
    });
  }

  deletePackage(packageId: number) {
    this.authServices.deletePackage(packageId).subscribe(
      response => {
        Swal.fire({
          title: 'Deleted',
          icon: 'success'
        });
        this.fetchPackage();
      },
      error => {
        console.error('Error Deleting Package', error);
        Swal.fire({
          title: 'Error',
          icon: 'error'
        });
      }
    );
  }

}
