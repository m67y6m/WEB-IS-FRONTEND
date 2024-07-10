declare var $: any;

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
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
  editRoomForm: FormGroup;
  rooms: Room[] = [];
  currentRoomId: number | null = null;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.roomForm = this.fb.group({
      roomType: ['', Validators.required],
      roomPrice: ['', Validators.required],
      roomPicture: ['', Validators.required]
    });

    this.editRoomForm = this.fb.group({
      roomType: ['', Validators.required],
      roomPrice: ['', Validators.required],
      roomPicture: ['']
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

  onEditFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.editRoomForm.patchValue({
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
            title: "Room Added Successfully",
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

  openEditModal(room: Room) {
    this.currentRoomId = room.roomId;
    this.editRoomForm.patchValue({
      roomType: room.roomType,
      roomPrice: room.roomPrice,
      roomPicture: '' // Leave this empty initially
    });
    $('#editRoomModal').modal('show');
  }

  resetForm() {
    this.editRoomForm.reset();
    this.currentRoomId = null;
  }

  onEditSubmit(): void {
    if (this.editRoomForm.valid && this.currentRoomId !== null) {
      console.log('Saving changes for room ID:', this.currentRoomId);

      const formData: FormData = new FormData();
      formData.append('roomType', this.editRoomForm.get('roomType')?.value || '');
      formData.append('roomPrice', this.editRoomForm.get('roomPrice')?.value || '');

      const roomPicture = this.editRoomForm.get('roomPicture')?.value;
      if (roomPicture instanceof File) {
        formData.append('roomPicture', roomPicture, roomPicture.name);
      }

      this.authService.updateRoom(this.currentRoomId, formData).subscribe(
        response => {
          console.log('Room Updated Successfully', response);
          Swal.fire({
            title: "Room Updated Successfully",
            icon: "success"
          });
          this.resetForm();
          this.fetchRooms(); // Refresh room list
          $('#editRoomModal').modal('hide');
        },
        error => {
          console.error('Error Updating Room', error);
          alert(error.message || 'Error! Can’t Update Room');
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
        this.deleteRoom(roomId);
      }
    });
  }

  deleteRoom(roomId: number) {
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

