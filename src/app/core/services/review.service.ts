import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
//storing local storage
  addUser(user:any){
    let users = [];
    if(localStorage.getItem('Basic-Info')){
      users = JSON.parse(localStorage.getItem('Basic-Info')as string)
      users = [...users,user];
    }
    else{
      users = [user];
    }
    localStorage.setItem('Basic-Info' ,JSON.stringify(users));
  }

  constructor() { }
}
