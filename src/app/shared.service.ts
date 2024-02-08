// ip-geolocation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {

  constructor(private http: HttpClient) {}

  getCurrentLocation(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position: any) => {
            observer.next(position);
            observer.complete();
          },
          (error: any) => {
            observer.error(error);
          }
        );
      } else {
        observer.error('Geolocation is not supported by your browser.');
      }
    });
  }

  public getIPAddress() {
    return this.http.get<{ ip: string }>('https://jsonip.com/')
  }
}