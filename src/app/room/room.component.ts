import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  roomForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.roomForm = this.fb.group({
      roomType: ['', Validators.required],
      roomPrice: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.roomForm.valid) {
      const roomData = {
        ...this.roomForm.value,
        roomStatus: 'Active'
      };

      this.authService.addRoom(roomData).subscribe(
        response => {
          console.log('Room Added Successfully', response);
          alert('Room Added Successfully');
          this.roomForm.reset();
        },
        error => {
          console.error('Error Adding Room', error);
          alert(error.message || 'Error! Can’t Add Rooms');
        }
      );
    }
  }
}
