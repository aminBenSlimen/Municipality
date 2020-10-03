import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';

@Injectable({
  providedIn: 'root'
})
export class SocialSharingService {

  constructor(private socialSharing: SocialSharing,
    private file: File) { }

  shareViaFacebook(claim) {
    let msg = claim.subject + ' in ' + claim.city + ': \n' + claim.description;

    this.socialSharing.shareViaFacebook(msg, claim.image).then(res => console.log(res))
  }
  shareViaEmail(claim, reciver) {
    let msg = claim.subject + ' in ' + claim.city
    this.socialSharing.shareViaEmail(msg, claim.description, [reciver], null, null, claim.image)

  }
  shareViaTwiter(claim) {
    let msg = claim.subject + ' in ' + claim.city + ': \n' + claim.description;

    this.socialSharing.shareViaTwitter(msg, claim.image)
  }
  shareViaWhatsApp(claim) {
    let msg = claim.subject + ' in ' + claim.city + ': \n' + claim.description;

    this.socialSharing.shareViaWhatsApp(msg, claim.image)
  }
  shareViaSMS(claim, reciver) {
    let msg = claim.subject + ' in ' + claim.city + ': \n' + claim.description;
    this.socialSharing.shareViaSMS(msg, reciver)
  }
}
