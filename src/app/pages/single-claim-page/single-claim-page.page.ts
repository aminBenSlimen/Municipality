import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, AlertController } from '@ionic/angular';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { Storage } from '@ionic/storage';
import { SocialSharingService } from 'src/app/services/socialSharing/social-sharing.service';


declare var map: Function; // function that load the map API

@Component({
  selector: 'app-single-claim-page',
  templateUrl: './single-claim-page.page.html',
  styleUrls: ['./single-claim-page.page.scss'],
})

export class SingleClaimPagePage implements OnInit {
  claim: any = null;
  likedClaimsKey = 'likedClaimsKey'
  likedClaims: any = [];
  splash: boolean = true;
  isTouched: boolean;
  scrolling: any;
  handledInTouchEnd: boolean;
  @ViewChild('IonContent', { static: false }) IonContent: IonContent;
  ScrollY: number;

  cssProp = { // data for css animations
    backGroundTop: "20%",
    textOpacity: 1,
    titleLeft: "10%",
    titleTop: "90%",
    titleSize: "30px",
    textTop: "16%"
  }
  slideOptsOne = {
    spaceBetween: 10,
    slidesPerView: 5,
    initialSlide: 0
  }
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private http: HttpClaimService,
    private storage: Storage,
    private alert: AlertController,
    private socialSharing: SocialSharingService
  ) {

    if (!this.claim)
      this.route.queryParams.subscribe((res) => { // getting data from the previous page
        this.claim = JSON.parse(res.p);
        this.claim.claimYLocation = res.claimYLocation;
        this.splash = false

      });
    this.storage.get(this.likedClaimsKey).then(e => {
      this.likedClaims = e;
    });
  }
  ngOnInit(): void {

  }



  touchstart() {
    this.isTouched = true;
  }
  touchend() {
    this.isTouched = false;
    if (!this.scrolling) {
      this.handledInTouchEnd = true;
      if (this.ScrollY > 60)
        this.IonContent.scrollToPoint(0, 150, 400);
      else if (this.ScrollY < 60)
        this.IonContent.scrollToTop(200)
    } else {
      this.handledInTouchEnd = false
    }
  }
  endScroll() {
    this.scrolling = false
    if (!this.handledInTouchEnd) {
      if (this.ScrollY > 60)
        this.IonContent.scrollToPoint(0, 150, 400);
      else if (this.ScrollY < 60)
        this.IonContent.scrollToTop(200)
    }
  }
  startScroll() {
    if (this.isTouched)
      this.scrolling = true
  }

  logScrollStart(ev) { // animations
    this.ScrollY = ev.detail.scrollTop;
    this.cssProp.backGroundTop = this.map(this.ScrollY, 0, 150, 0, 20)
    this.cssProp.backGroundTop = 20 - Number(this.cssProp.backGroundTop) + "%"
    this.cssProp.textOpacity = this.map(this.ScrollY, 0, 110, 0, 1);
    this.cssProp.textOpacity = 1 - this.cssProp.textOpacity;
    this.cssProp.titleSize = this.map(this.ScrollY, 0, 150, 30, 25) + "px";
    this.cssProp.titleTop = this.map(this.ScrollY, 0, 150, 90, 25) + "%";
    this.cssProp.titleLeft = this.map(this.ScrollY, 0, 150, 10, 17) + "% ";
    this.cssProp.textTop = this.map(this.ScrollY, 0, 150, 16, 12) + "%";
  }
  map(x, in_min, in_max, out_min, out_max) {
    if (x < in_min)
      x = in_min
    else if (x > in_max)
      x = in_max
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  backward() {
    this.router.navigate(["/all-claims"], {
      queryParams: { p: this.claim.claimYLocation },
    })
  }
  ionViewWillEnter() {
    map([this.claim.lng, this.claim.lat], true);
  }

  isNotCameraImage(name) {
    return name.substring(0, 8) == "./assets"
  }
  calculateHeartTop(n) {
    let im = document.getElementById('userImage').clientHeight
    let len = document.getElementById('content').clientHeight
    let card = document.getElementById('cardContent').clientHeight
    switch (n) {
      case 1:
        return (im / len) * 100 - 6 + '%';
      case 2:
        return (im / len) * 100 + 12 + '%';
      case 3:
        return (im / len) * 100 + 30 + '%';
      case 4:
        return (im / len) * 100 + (card / len) * 100 + 40 + '%'

      default:
        break;
    }




  }

  upvote() {
    if (!this.likedClaims)
      this.likedClaims = []


    if (this.claim.state == 'heart-outline') {
      this.claim.state = 'heart'
      this.claim.upvote++;
      this.http.updateUpvote(this.claim).subscribe()

      this.likedClaims.push(this.claim.id)
      this.storage.set(this.likedClaimsKey, this.likedClaims)
    } else if (this.claim.state == 'heart') {
      this.claim.state = 'heart-outline'
      this.claim.upvote--;
      this.http.updateUpvote(this.claim).subscribe()
      const index = this.likedClaims.indexOf(this.claim.id)
      if (index > -1) {
        this.likedClaims.splice(index, 1);
        this.storage.set(this.likedClaimsKey, this.likedClaims)
      }
    }
  }
  shareVia(socialMedia) {
    switch (socialMedia) {
      case 'facebook':
        this.socialSharing.shareViaFacebook(this.claim)
        break;
      case 'twitter':
        this.socialSharing.shareViaTwiter(this.claim)
        break;
      case 'whatsapp':
        this.socialSharing.shareViaWhatsApp(this.claim)
        break;
      case 'sms':
        var reciver = '23746742'
        this.alert.create({
          header: 'Send To :',
          inputs: [{
            name: 'reciver',
            type: 'number',
            label: 'Send To : ',
            value: ''
          },],
          message: '',
          buttons: [{
            text: "ok",
            handler: (value) => {
              reciver = value.reciver;
              this.socialSharing.shareViaSMS(this.claim, reciver)
            }
          }, "Cancel"]
        }).then(alert => alert.present())
        break;
      case 'mail':
        var reciver = 'aminbenslimen00@gmail.com'
        this.alert.create({
          header: 'Send To :',
          inputs: [{
            name: 'reciver',
            type: 'text',
            label: 'Send To : ',
            value: ''
          },],
          message: '',
          buttons: [{
            text: "ok",
            handler: (value) => {
              reciver = value.reciver;
              this.socialSharing.shareViaEmail(this.claim, reciver)
            }
          }, "Cancel"]
        }).then(alert => alert.present())

        break;

      default:
        break;
    }
  }
}
