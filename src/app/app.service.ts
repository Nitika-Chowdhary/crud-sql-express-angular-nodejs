import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get('/getallusers').toPromise();
  }

  getUserById(id: number) {
    return this.http.get(`/userid/?id=${id}`).toPromise();
  }

  deleteUserById(id: number) {
    return this.http.delete(`/userid/${id}`).toPromise();
  }
  
  updateUserDetails(newValue: any) {
    return this.http.put(`/userid/${newValue.Id}`, newValue).toPromise();
  }

  addNewUser(newUser: any) {
    return this.http.post('/userid/0', newUser).toPromise();
  }
}
