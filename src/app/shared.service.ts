// ip-geolocation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private apiUrl = 'https://api.ipgeolocationapi.com/geolocate';

  constructor(private http: HttpClient) {}

  getIpAndLocation(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  public getIPAddress() {
    return this.http.get<{ ip: string }>('https://jsonip.com/')
  }
}