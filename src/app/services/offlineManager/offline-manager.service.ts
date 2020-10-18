import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

const STORAGE_REQ_KEY = 'storedreq';

interface StoredRequest {
  url: string,
  type: string,
  data: any,
  time: number,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  constructor(private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController) { }

  checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(storedOperations => {
        console.log(storedOperations);

        let storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
            finalize(() => {
              let toast = this.toastController.create({
                message: `Local data succesfully synced to API!`,
                duration: 3000,
                position: 'bottom'
              });
              toast.then(toast => toast.present());
              this.storage.remove(STORAGE_REQ_KEY);
            })
          );
        } else {
          //  console.log('no local events to sync');
          return of(false);
        }
      })
    )
  }

  storeRequest(url, type, data) {
    let toast = this.toastController.create({
      message: `Your data is stored locally because you seem to be offline.`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());

    let action: StoredRequest = {
      url: url,
      type: type,
      data: data,
      time: new Date().getTime(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };
    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }

  sendRequests(operations: StoredRequest[]) {


    let obs = [];
    for (let op of operations) {
      let oneObs;
      if (op.url == 'https://api.imgur.com/3/image') {
        let image: string = op.data.image;
        image = image.substring(22, image.length)
        let d = {
          'image': image,
          'type': 'base64'
        }

        let header = new HttpHeaders({
          "authorization": 'Client-ID ' + "3b4997d04fffe7c"
        });
        this.http.post(op.url, d, { headers: header }).subscribe(inf => {

          let image: any = inf;
          op.data.image = image.data.link;
          console.log(image.data.link);

          op.data.upvote = 0;
          op.data.report = 0;
          let headers: HttpHeaders = new HttpHeaders();
          headers.append("Access-Control-Allow-Origin", '*');
          headers.append("Access-Control-Allow-Methods", 'POST, GET, OPTIONS, DELETE');
          headers.append("Access-Control-Allow-Headers", '*');
          headers.append('Content-Type', 'application/json');
          headers.append('Accept', 'application/json,text/plain');
          const params = new HttpParams()
            .set('type', op.data.type)
            .set('email', op.data.email)
            .set('uid', op.data.uid)
            .set('lat', op.data.lat)
            .set('lng', op.data.lng)
            .set('city', op.data.city)
            .set('municipalite', op.data.municipalite)
            .set('subject', op.data.subject)
            .set('description', op.data.description)
            .set('image', op.data.image)
            .set('upvote', op.data.upvote)
            .set('report', op.data.report)
          let requestOptions = { headers: headers, params: params }
          this.http.post('https://municipality00.000webhostapp.com/public/api/Claims', null, requestOptions).subscribe()
        }, err => {
          console.log('error in the complicated offline request');
        })
      } else {
        const params = new HttpParams()
          .set('type', op.data.type)
          .set('email', op.data.email)
          .set('uid', op.data.uid)
          .set('lat', op.data.lat)
          .set('lng', op.data.lng)
          .set('city', op.data.city)
          .set('municipalite', op.data.municipalite)
          .set('subject', op.data.subject)
          .set('description', op.data.description)
          .set('image', op.data.image)
          .set('upvote', op.data.upvote)
          .set('report', op.data.upvote)
        let headers: HttpHeaders = new HttpHeaders();
        headers.append("Access-Control-Allow-Origin", '*');
        headers.append("Access-Control-Allow-Methods", 'POST, GET, OPTIONS, DELETE');
        headers.append("Access-Control-Allow-Headers", '*');
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json,text/plain');
        let requestOptions = { headers: headers, params: params }
        if (op.data.id)
          oneObs = this.http.post(op.url + '/' + op.data.id, null, requestOptions)
        else {
          return this.http.post(op.url, null, requestOptions)
        }
        obs.push(oneObs);
      }
    }
    return forkJoin(obs);
  }
}