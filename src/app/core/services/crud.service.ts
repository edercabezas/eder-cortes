import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  private apiUrl = '/bp/products';
  private _HEADERS: HttpHeaders;

  constructor(private http: HttpClient) {
    this._HEADERS = new HttpHeaders({'Content-Type': 'application/json'});
  }

  async readData(router: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.get(`${this.apiUrl}`).subscribe( (response: any) => {
          return resolve(response);
        });
    });
  }

  postData(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }



  async getById(id: string, endpoint: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.get(`${this.apiUrl}${endpoint}/${id.toString()}`).subscribe({
        next: (response: any) => {
          if (response.data) {
            response = response.data;
          }

          resolve(response);
        },
        error: err => reject(err)
      });
    });
  }

  async getByIdEdit(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.get(`${this.apiUrl}/${id.toString()}`).subscribe({
        next: (response: any) => {
          if (response.data) {
            response = response.data;
          }

          resolve(response);
        },
        error: err => reject(err)
      });
    });
  }


  async put(request: any, id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.http.put(`${this.apiUrl}/${id.toString()}`, request).subscribe({
        next: (response: any) => {
          if (response.data) {
            response = response.data;
          }

          resolve(response);
        },
        error: err => reject(err)
      });
    });
  }

 delete(id: any): Observable<any> {
  return this.http.delete<any>(this.apiUrl + '/' + id);
}

}
