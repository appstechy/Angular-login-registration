import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  private apiUrl = 'http://localhost:3000/api';
  private loggedInFullName: string = ''
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any>{
    const credentials = { username, password };
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }



  register(username: string, password:string, fullName:string, gender: string, dateOfBirth: string, email: string, phoneNumber: string): Observable<any>{
    const credentials = { username, password, fullName, gender, dateOfBirth, email, phoneNumber };
    return this.http.post<any>(`${this.apiUrl}/register`, credentials);

  }


  update(username: string, password:string, fullName:string, gender: string, dateOfBirth: string, email: string, phoneNumber: string, username2: string): Observable<any>{
    const credentials = { username, password, fullName, gender, dateOfBirth, email, phoneNumber, username2 };
    return this.http.post<any>(`${this.apiUrl}/updateUser`, credentials);

  }

  saveToken(token: string){
    localStorage.setItem('token', token);
    
  }


  getToken(){
    return localStorage.getItem('token');

  }

  fetchFullName(): Observable<any>{
    const token = this.getToken();
    console.log("fetchFullName()-",token);
    if(!token){
      return new Observable(observer => observer.next({ success: false, message: 'No token found.' }));

    }

    return this.http.get<any>(`${this.apiUrl}/getFullName`, {
      headers:{
        Authorization: token
      }
    });
  }


  fetchAllDetails():Observable<any>{
    const token = this.getToken();
    console.log("fetchAllDetails()-",token);
    if(!token){
      return new Observable(observer => observer.next({ success: false, message: 'No token found.' }));

    }

    return this.http.get<any>(`${this.apiUrl}/fetchAllDetails`, {
      headers:{
        Authorization: token
      }
    });

  }


  logout(){
    localStorage.removeItem('token');
  }

  isUserLoggedIn():boolean{
    const token = this.getToken();

    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean{
    const decodedToken: any = jwt_decode(token);
    if(decodedToken && decodedToken.exp){
      const expirationTime = decodedToken.exp * 1000;
      return Date.now() >= expirationTime;
    }

    return false;
  }

}

