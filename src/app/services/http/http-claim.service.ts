import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OfflineManagerService } from '../offlineManager/offline-manager.service';
import { NetworkService, ConnectionStatus } from '../network/network.service';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";

const API_STORAGE_KEY = 'specialkey';
// const url = 'http://192.168.137.122/my-app-v2/public/api/Claims';
// const url = 'http://192.168.137.122/my-app-v2/public/api/Claims';
const url = 'http://192.168.1.113/Municipalite/public/api/Claims';

@Injectable({
  providedIn: 'root'
})
export class HttpClaimService {
  data: any = [];
  constructor(public http: HttpClient, private networkService: NetworkService
    , private offlineManager: OfflineManagerService, private storage: Storage) { }

  getData() {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append("Access-Control-Allow-Origin", '*');
    headers.append("Access-Control-Allow-Methods", 'POST, GET, OPTIONS, DELETE');
    headers.append("Access-Control-Allow-Headers", '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json,text/plain');
    let requestOptions = { headers: headers }
    return this.http.get(url, requestOptions)

  }


  postData(data: any) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      return from(this.offlineManager.storeRequest(url, 'POST', data));
    } else {
      console.log(url);
      let headers: HttpHeaders = new HttpHeaders();
      headers.append("Access-Control-Allow-Origin", '*');
      headers.append("Access-Control-Allow-Methods", 'POST, GET, OPTIONS, DELETE');
      headers.append("Access-Control-Allow-Headers", '*');
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json,text/plain');
      let requestOptions = { headers: headers }
      return this.http.post(url, data, requestOptions)
    }
  }
  // call this function and use it
  getLocalData() {
    return this.storage.get(`${API_STORAGE_KEY}`);
  }


}
