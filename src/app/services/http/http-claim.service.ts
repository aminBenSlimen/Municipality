import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OfflineManagerService } from '../offlineManager/offline-manager.service';
import { NetworkService, ConnectionStatus } from '../network/network.service';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";

const API_STORAGE_KEY = 'specialkey';
// const url = 'http://192.168.137.122/my-app-v2/public/api/Claims';
// const url = 'http://192.168.137.122/my-app-v2/public/api/Claims';
const url = 'https://municipality00.000webhostapp.com/public/api/Claims';

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
    let headers: HttpHeaders = new HttpHeaders();
    headers.append("Access-Control-Allow-Origin", '*');
    headers.append("Access-Control-Allow-Methods", 'POST, GET, OPTIONS, DELETE');
    headers.append("Access-Control-Allow-Headers", '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json,text/plain');
    const params = new HttpParams()
      .set('type', data.type)
      .set('email', data.email)
      .set('uid', data.uid)
      .set('lat', data.lat)
      .set('lng', data.lng)
      .set('city', data.city)
      .set('municipalit', data.municipalite)
      .set('subject', data.subject)
      .set('description', data.description)
      .set('image', data.image)
      .set('upvote', data.upvote)
    let requestOptions = { headers: headers, params: params }
    return this.http.post(url, null, requestOptions)
  }
  // call this function and use it
  getLocalData() {
    return this.storage.get(`${API_STORAGE_KEY}`);
  }
  updateUpvote(claim) {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append("Access-Control-Allow-Origin", '*');
    headers.append("Access-Control-Allow-Methods", 'POST, GET, OPTIONS, DELETE,PUT');
    headers.append("Access-Control-Allow-Headers", '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json,text/plain');
    const params = new HttpParams()
      .set('type', claim.type)
      .set('email', claim.email)
      .set('uid', claim.uid)
      .set('lat', claim.lat)
      .set('lng', claim.lng)
      .set('city', claim.city)
      .set('municipalite', claim.municipalite)
      .set('subject', claim.subject)
      .set('description', claim.description)
      .set('image', claim.image)
      .set('upvote', claim.upvote)
    let requestOptions = { headers: headers, params: params }
    return this.http.post(url + '/' + claim.id, null, requestOptions)
  }


}
