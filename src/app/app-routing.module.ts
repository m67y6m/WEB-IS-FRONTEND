// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomComponent } from './room/room.component';
import { BookingComponent } from './booking/booking.component';
import { PaymentComponent } from './payment/payment.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PackageComponent } from './package/package.component';
import { CustomerComponent } from './customer/customer.component';
import { SettingsComponent } from './settings/settings.component';
import { LayoutComponent } from './layout/layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { CustomerBookingsComponent } from './customer-bookings/customer-bookings.component';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';
import path from 'path';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: '',
    component: MainLayoutComponent,
    children: [
    
  { path: 'dashboard', component: DashboardComponent },
  { path: 'room', component: RoomComponent},
  { path: 'booking', component: BookingComponent},
  { path: 'customerHome', component: CustomerHomeComponent},
  { path: 'package', component: PackageComponent},
  { path: 'payment', component: PaymentComponent},
  { path: 'analytics', component: AnalyticsComponent},
  { path: 'customerBookings', component: CustomerBookingsComponent},
  { path: 'customerPayments', component: CustomerPaymentsComponent},
  { path: 'customer', component: CustomerComponent},
  { path: 'settings', component: SettingsComponent}
  
    ]
  },

  {
    path: '',
    component: LayoutComponent,
    children:  [
      { path: 'login', component: LoginComponent },
      { path: 'sign-up', component: SignUpComponent },
    ]
  }
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
