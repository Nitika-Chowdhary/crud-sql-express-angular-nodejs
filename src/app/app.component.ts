import { AppService } from './app.service';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  users = [];
  loading = false;
  
  userName: string;
  userEmail: string;
  userAddress: string;

  newName: string;
  newEmail: string;
  newAddress: string;

  dialogMessage: string;
  showDialog: boolean;
  editMode = {};

  constructor(private service: AppService) {}

  openDialog(message: string) {
    this.showDialog = true;
    this.dialogMessage = message;
  }

  getAllUsers() {
    this.users = [];
    this.loading = true;
    this.service.getUsers()
      .then((resp: any) => {
        this.loading = false;
        this.users = resp;
      })
      .catch(err => {
        this.loading = false;
        this.openDialog('Error while fetching users');
      });
  }

  deleteRow(index) {
    this.service.deleteUserById(this.users[index].Id).then(resp => {
      this.openDialog('User successfully deleted');
      this.getAllUsers();
    });
  }

  toggelEditMode(index, shouldSave) {
    if (shouldSave) {
      this.updateUserDetails(index);
      this.editMode[index] = false;
    } else {
      this.userName = this.users[index].Name;
      this.userEmail = this.users[index].Email;
      this.userAddress = this.users[index].Address;
      Object.keys(this.editMode).forEach(element => {
        this.editMode[element] = false;
      });
      this.editMode[index] = true;
    }
  }

  updateUserDetails(index) {
    const newValue = {
      Id: this.users[index].Id,
      Name: this.userName,
      Email: this.userEmail,
      Address: this.userAddress
    };
    this.service
      .updateUserDetails(newValue)
      .then((res: any) => {
        if (res.message === 'success') {
          this.getAllUsers();
          this.openDialog('User successfully updated');
        } else {
          this.openDialog('User can not be updated');
        }
      })
      .catch(err => {
        this.openDialog('Problem updating user');
      });
  }

  addUser()  {
    const newUser = {
      Name: this.newName,
      Email: this.newEmail,
      Address: this.newAddress
    };
    this.service
      .addNewUser(newUser)
      .then((res: any) => {
        if (res.message === 'success') {
          this.getAllUsers();
          this.openDialog('User successfully added');
        } else {
          this.openDialog('User can not be added');
        }
      })
      .catch(err => {
        this.openDialog('Problem in adding user');
      });
  };

  closeButton() {
    this.showDialog = false;
  }
}
