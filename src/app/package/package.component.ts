declare var $: any;

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

export interface Package {
  packageId: number;
  packageType: string;
  packagePrice: number;
}

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css']
})
export class PackageComponent implements OnInit {
  packageForm: FormGroup;
  packages: Package[] = [];
  selectedPackage: Package | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.packageForm = this.fb.group({
      packageType: ['', Validators.required],
      packagePrice: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchPackages();
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
    if (this.packageForm.valid) {
      const packageData = this.packageForm.value;

      if (this.selectedPackage) {
        console.log('Updating package with ID:', this.selectedPackage.packageId);
        console.log('Form Data:', packageData);

        this.authService.updatePackage(this.selectedPackage.packageId, packageData).subscribe(
          response => {
            console.log('Package Updated Successfully', response);
            Swal.fire({
              title: 'Package Updated Successfully',
              icon: 'success'
            });
            this.resetForm();
            this.fetchPackages();
            $('#exampleModal').modal('hide');
          },
          error => {
            console.error('Error Updating Package', error);
            Swal.fire({
              title: 'Error Updating Package',
              text: error.message,
              icon: 'warning'
            });
          }
        );
      } else {
        console.log('Adding new package');
        console.log('Form Data:', packageData);

        this.authService.addPackage(packageData).subscribe(
          response => {
            console.log('Package Added Successfully', response);
            Swal.fire({
              title: 'Package Added Successfully',
              icon: 'success'
            });
            this.resetForm();
            this.fetchPackages();
          },
          error => {
            console.error('Error Adding Package', error);
            Swal.fire({
              title: 'Error Adding Package',
              text: error.message,
              icon: 'warning'
            });
          }
        );
      }
    }
  }
  

  editPackage(packageId: number) {
    const selectedPackage = this.packages.find(pkg => pkg.packageId === packageId);
    if (selectedPackage) {
      this.selectedPackage = selectedPackage;
      this.packageForm.patchValue({
        packageType: selectedPackage.packageType,
        packagePrice: selectedPackage.packagePrice
      });
      $('#exampleModal').modal('show');
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
    this.authService.deletePackage(packageId).subscribe(
      response => {
        Swal.fire({
          title: 'Deleted',
          icon: 'success'
        });
        this.fetchPackages();
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

  resetForm() {
    this.packageForm.reset();
    this.selectedPackage = null;
  }
}
