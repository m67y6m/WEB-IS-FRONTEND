import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { response } from 'express';
import { error } from 'console';
import Swal from 'sweetalert2';

export interface Room {
  roomId: number;
  roomType: string;
  roomPrice: number;
  roomStatus: string;
  roomPicture: string;
}

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  roomForm: FormGroup;
  rooms: Room[] = [];

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.roomForm = this.fb.group({
      roomType: ['', Validators.required],
      roomPrice: ['', Validators.required],
      roomPicture: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchRooms();
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

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.roomForm.patchValue({
        roomPicture: file
      });
    }
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const formData: FormData = new FormData();
      formData.append('roomType', this.roomForm.get('roomType')?.value || '');
      formData.append('roomPrice', this.roomForm.get('roomPrice')?.value || '');

      const roomPicture = this.roomForm.get('roomPicture')?.value;
      if (roomPicture instanceof File) {
        formData.append('roomPicture', roomPicture, roomPicture.name);
      }

      this.authService.addRoom(formData).subscribe(
        response => {
          console.log('Room Added Successfully', response);
          Swal.fire({
            title: "Room Added Successfullys",
            icon: "success"
          });
          this.roomForm.reset();
          this.fetchRooms(); // Refresh room list
        },
        error => {
          console.error('Error Adding Room', error);
          alert(error.message || 'Error! Can’t Add Rooms');
        }
      );
    }
  }

  confirmDelete(roomId: number) {
    Swal.fire({
      title: "Are You Sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"

    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRooms(roomId);
      }
    });
  }

  deleteRooms(roomId: number) {
    this.authService.deleteRoom(roomId).subscribe(
      response => {
        Swal.fire({
          title: "Deleted",
          icon: "success"
        });
        this.fetchRooms();
      }, 
      error => {
        console.error('Error Deleting Room', error);
        Swal.fire({
          title: "Error",
          icon: "error"
        });
      }
    );
  }
}
