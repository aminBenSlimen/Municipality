import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OfflineManagerService } from '../offlineManager/offline-manager.service';
import { NetworkService, ConnectionStatus } from '../network/network.service';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { tap, map, catchError } from "rxjs/operators";

const API_STORAGE_KEY = 'storageKey';
// const url = 'http://192.168.137.122/my-app-v2/public/api/Claims';
// const url = 'http://192.168.137.122/my-app-v2/public/api/Claims';
const url = 'https://municipality00.000webhostapp.com/public/api/Claims';


interface ImageInfo {
  title: string;
  description: string;
  link: string;
}

@Injectable({
  providedIn: 'root'
})


export class HttpClaimService {
  data: any = [];
  constructor(public http: HttpClient,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private storage: Storage) { }

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

  uploadImage(data) {
    let image: string = data.image;
    image = image.substring(22, image.length)
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this.offlineManager.storeRequest(url, 'POST', data)
    } else {

      let d = {
        'image': image,
        'type': 'base64'
      }
      let header = new HttpHeaders({
        "authorization": 'Client-ID ' + "3b4997d04fffe7c"
      });
      return this.http.post('https://api.imgur.com/3/image', d, { headers: header });

    }
  }


  postData(data: any) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this.offlineManager.storeRequest(url, 'POST', data)
    }
    else {
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
        .set('municipalite', data.municipalite)
        .set('subject', data.subject)
        .set('description', data.description)
        .set('image', data.image)
        .set('upvote', data.upvote)
        .set('report', data.report)

      let requestOptions = { headers: headers, params: params }
      return this.http.post(url, null, requestOptions)
    }
  }
  // call this function and use it
  getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }
  updateUpvote(claim) {
    if (this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Offline) {
      this.offlineManager.storeRequest(url, 'POST', claim)
    } else {

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
        .set('report', claim.report)
      let requestOptions = { headers: headers, params: params }
      return this.http.post(url + '/' + claim.id, null, requestOptions)
    }
  }
  verifyEmail(email) {
    let url = "https://app.verify-email.org/api/v1/4O8mL8MDfIXaLqAcu3jXYdWdTy1obqp5lH2iJ1XtbZc1EgAeUA/verify/" + email
    let headers: HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.get(url)
  }
  getCityFromApi(lat, lng) {
    // return this.http.get("https://geocode.xyz/" + lat + "," + lng + "?geoit=json")
    return this.http.get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + lng + "&key=cbc9e18a49de47a98d56a942bfba38c2")
  }

  updateReport(claim) {
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
      .set('report', claim.report)
    let requestOptions = { headers: headers, params: params }
    return this.http.post(url + '/' + claim.id, null, requestOptions)
  }
}
