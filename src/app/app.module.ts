import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RoomComponent } from './room/room.component';
import { BookingComponent } from './booking/booking.component';
import { PaymentComponent } from './payment/payment.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { CustomerComponent } from './customer/customer.component';
import { SettingsComponent } from './settings/settings.component';
import { LayoutComponent } from './layout/layout.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { PackageComponent } from './package/package.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { CustomerBookingsComponent } from './customer-bookings/customer-bookings.component';
import { CustomerPaymentsComponent } from './customer-payments/customer-payments.component';
import { AuthService } from './auth.service';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    SidebarComponent,
    RoomComponent,
    BookingComponent,
    PaymentComponent,
    PackageComponent,
    AnalyticsComponent,
    CustomerComponent,
    SettingsComponent,
    LayoutComponent,
    MainLayoutComponent,
    PackageComponent,
    CustomerHomeComponent,
    CustomerBookingsComponent,
    CustomerPaymentsComponent,
  
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
