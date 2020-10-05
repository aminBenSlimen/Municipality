import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { PopoverController, IonSearchbar, IonContent, AlertController } from '@ionic/angular';
import { NetworkService, ConnectionStatus } from 'src/app/services/network/network.service';
import { Storage } from '@ionic/storage';
import { SocialSharingService } from 'src/app/services/socialSharing/social-sharing.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-all-claims',
  templateUrl: './all-claims.page.html',
  styleUrls: ['./all-claims.page.scss'],
})

export class AllClaimsPage implements OnInit {
  @ViewChild('secondSearchBar', { static: false }) seconSearchBar: IonSearchbar;
  @ViewChild('FirstSearchBar', { static: false }) FirstSearchBar: IonSearchbar;
  @ViewChild('IonContent', { static: false }) IonContent: IonContent;
  @ViewChild('selectCat', { read: ElementRef, static: true }) selectCat: ElementRef;

  likedClaimsKey = 'likedClaimsKey'
  likedClaims: any = [];
  notWantedClaimKey = "notWantedClaimKey"
  notWantedClaims = []
  claims: any = [];
  oxClaims: any = [];
  searchBar = "";
  Online;
  showSkeleton = true;
  claimWithShareOn = null;
  claimWithReportOn = null;
  cssProp = { // data for css animations
    backGroundTop: "30%",
    textOpacity: 1,
    titleLeft: "10%",
    titleTop: "90%",
    titleSize: "30px",
    textTop: "16%",
    srachBarDisplay: 'none',
    searchBarTop: '0%'
  }
  ScrollY: number;
  handledInTouchEnd: boolean = true;
  scrolling: boolean;
  isTouched: boolean;


  constructor(private sanitizer: DomSanitizer,
    private network: Network,
    public http: HttpClaimService,
    private router: Router,
    private route: ActivatedRoute,
    private popOver: PopoverController,
    private networkService: NetworkService,
    private storage: Storage,
    public alert: AlertController,
    private socialSharing: SocialSharingService,
    private translate: TranslateService) {
    this.likedClaims = []
    this.notWantedClaims = []
    this.Online = networkService.getCurrentNetworkStatus() == ConnectionStatus.Online ? true : false
    if (this.Online)
      this.loadData()
    else {
      this.showSkeleton = false;
      this.presentPopover({
        bigImage: './assets/images/nodata.png',
        content: 'You Are in offline mode you Cant see Claims !',
        role: "GoToWelcomePage"
      });
      return
    }


  }
  getImgContent(image: string): any {
    if (image == './assets/images/NoImage.jpeg')
      return './assets/images/NoImage.jpg'
    else {
      let x: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(image);
      return x;
    }
  }

  filterList(evt, val = null) {
    this.searchBar = (evt) ? evt.srcElement.value : val;
    const searchTerm = (evt) ? evt.srcElement.value : val;
    if (!searchTerm || searchTerm == "") {
      this.claims = this.oxClaims;
      return;
    }


    this.claims = this.claims.filter(currentGoal => {
      if (currentGoal.city && searchTerm) {

        if (currentGoal.city.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }
  setRealSearchBar(evt) {
    this.FirstSearchBar.value = evt.srcElement.value;
    this.filterList(null, evt.srcElement.value)
    this.FirstSearchBar.setFocus()

  }
  ionViewDidEnter() {

    this.loadData()
    this.showSkeleton = true

    setTimeout(() => {
      this.route.queryParams.subscribe((res) => {
        this.showSkeleton = false
        this.ScrollY = res.p;
        this.IonContent.scrollToPoint(0, this.ScrollY, 400);
      });

    }, 2000);
  }
  reset() {
    this.claims = this.oxClaims;
  }

  setTime(date: string): string {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();

    let ToDay = minutes + hour * 60 + day * (60 * 24) + month * (60 * 24 * 30) + year * (60 * 24 * 30 * 12);

    const Dyear = Number(date.substring(0, 4))
    const Dmonth = Number(date.substring(5, 7))
    const Dday = Number(date.substring(8, 11))
    const Dhour = Number(date.substring(11, 13)) + 1
    const Dminutes = Number(date.substring(14, 16)) + 1

    let ClaimDay = Dminutes + Dhour * 60 + Dday * (60 * 24) + Dmonth * (60 * 24 * 30) + Dyear * (60 * 24 * 30 * 12);
    let def = ToDay - ClaimDay;

    const defMinutes = Math.floor(def % 60);
    const defHour = Math.floor(def / 60);
    const defDDay = Math.floor(def / (60 * 24));
    const defDmounth = Math.floor(def / (60 * 24 * 30));
    const defDyear = Math.floor(def / (60 * 24 * 30 * 12));

    if (defDyear > 0) return this.translate.instant("ALLCLAIMS.timers.yearAgo", { d: defDyear });
    if (defDmounth > 0) return this.translate.instant("ALLCLAIMS.timers.mounthsAgo", { d: defDmounth });
    if (defDDay > 0) return this.translate.instant("ALLCLAIMS.timers.daysAgo", { d: defDDay });
    if (defHour > 2) return this.translate.instant("ALLCLAIMS.timers.hours", { d: defHour });
    if (defHour > 0) return this.translate.instant("ALLCLAIMS.timers.hoursAndMin", { d1: defHour, d2: defMinutes });
    if (defMinutes <= 0) this.translate.instant("ALLCLAIMS.timers.justNow");
    else
      return this.translate.instant("ALLCLAIMS.timers.minutes", { d: defMinutes });

  }
  ngOnInit() {
  }
  forward() {
    this.router.navigate([""]);
    return
  }

  getTime(claim) {
    return this.setTime(claim);
  }

  async presentPopover(cont: any) {
    const popover = await this.popOver.create({
      component: PopoverComponentComponent,
      componentProps: cont,
      translucent: true,
      animated: true,
      backdropDismiss: false
    });
    return await popover.present();
  }
  upvote(claim) {
    this.claims.forEach(elm => {
      if (elm.id == claim.id) {
        if (claim.state == 'heart-outline') {
          elm.upvote++;
          this.http.updateUpvote(elm).subscribe(res => {
            console.log(res);

          }, err => {
            console.log(err);

          })
          if (!this.likedClaims)
            this.likedClaims = []
          this.likedClaims.push(elm.id)
          this.storage.set(this.likedClaimsKey, this.likedClaims)
          elm.state = 'heart'
        } else {
          elm.state = 'heart-outline'
          elm.upvote--;
          this.http.updateUpvote(elm).subscribe(res => {
            console.log('succ');

          }, err => {
            console.log(err);

          })
          const index = this.likedClaims.indexOf(claim.id)
          if (index > -1) {
            this.likedClaims.splice(index, 1);
            console.log(this.likedClaims);
            this.storage.set(this.likedClaimsKey, this.likedClaims)
          }
        }
      }
    });
  }
  touchstart(e) {
    this.isTouched = true;
  }
  touchend(e) {

    this.isTouched = false;
    if (!this.scrolling) {
      this.handledInTouchEnd = true;
      if (this.ScrollY > 60 && this.ScrollY < 150)
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
      if (this.ScrollY > 60 && this.ScrollY < 150)
        this.IonContent.scrollToPoint(0, 150, 400);
      else if (this.ScrollY < 60)
        this.IonContent.scrollToTop(200)
    }
  }
  clickOnBg() {
    this.claimWithShareOn = null
    this.claimWithReportOn = null;
  }
  startScroll() {

    this.claimWithShareOn = null
    this.claimWithReportOn = null;

    if (this.isTouched)
      this.scrolling = true
  }
  showDisplayFactor() {
    this.selectCat.nativeElement.click()
  }
  changeDisplayFactor() {
    this.claims = this.oxClaims;
    if (this.selectCat.nativeElement.value == "Newest") {
      this.storage.set('ClientFavDisplayFactor', "Newest")
      this.claims = this.claims.sort((a, b) => -Number(this.dateToNumber(a.created_at)) + Number(this.dateToNumber(b.created_at)))
    } else if (this.selectCat.nativeElement.value == "Hotest") {
      this.storage.set('ClientFavDisplayFactor', "Hotest")
      this.claims = this.claims.sort((a, b) => b.upvote - a.upvote)

    }
    else if (this.selectCat.nativeElement.value == "Mine") {
      this.storage.set('ClientFavDisplayFactor', "Mine")
      this.storage.get("uuid").then(id => {
        id = "m"
        this.claims = this.claims.filter(claim => {
          if (id == claim.uid) {
            return true;
          }
        })
      })
    }
  }
  dateToNumber(created_at: String) {
    const Dyear = Number(created_at.substring(0, 4))
    const Dmonth = Number(created_at.substring(5, 7))
    const Dday = Number(created_at.substring(8, 11))
    const Dhour = Number(created_at.substring(11, 13)) + 1
    const Dminutes = Number(created_at.substring(14, 16)) + 1

    let ClaimDay = Dminutes + Dhour * 60 + Dday * (60 * 24) + Dmonth * (60 * 24 * 30) + Dyear * (60 * 24 * 30 * 12);
    return ClaimDay;
  }
  logScrollStart(ev) { // animations

    let top = this.ScrollY = ev.detail.scrollTop;
    this.cssProp.backGroundTop = this.map(top, 0, 150, 0, 20)
    this.cssProp.backGroundTop = 30 - Number(this.cssProp.backGroundTop) + "%"
    this.cssProp.textOpacity = this.map(top, 0, 110, 0, 1);
    this.cssProp.textOpacity = 1 - this.cssProp.textOpacity;
    this.cssProp.titleSize = this.map(top, 0, 150, 30, 25) + "px";
    this.cssProp.titleTop = this.map(top, 0, 150, 90, 25) + "%";
    this.cssProp.titleLeft = this.map(top, 0, 150, 10, 17) + "% ";
    this.cssProp.textTop = this.map(top, 0, 150, 16, 12) + "%";
    this.cssProp.searchBarTop = this.map(top, 0, 150, 0, 10) + "%";
    if (top < 10) {
      this.cssProp.srachBarDisplay = 'none'
      this.seconSearchBar.value = ''
    }
  }

  map(x, in_min, in_max, out_min, out_max) {
    if (x < in_min)
      x = in_min
    else if (x > in_max)
      x = in_max
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  popTheSearchBar() {
    if (this.cssProp.searchBarTop == '10%') {
      this.cssProp.searchBarTop = '0%'
      this.cssProp.srachBarDisplay = 'none'
      return
    }

    this.seconSearchBar.setFocus()
    if (this.cssProp.textOpacity > 0.5)
      return
    this.cssProp.srachBarDisplay = 'block'
    this.cssProp.searchBarTop = '10%'
  }
  shareClaim(claim) {
    if (this.claimWithShareOn == claim.id)
      this.claimWithShareOn = null
    else
      this.claimWithShareOn = claim.id;
    //  this.socialSharing.
  }
  ReportUIClaim(claim) {
    if (this.claimWithReportOn == claim.id)
      this.claimWithReportOn = null
    else
      this.claimWithReportOn = claim.id;
    //  this.socialSharing.
  }
  doRefresh(event) {
    console.log('hi');

    this.showSkeleton = true;
    setTimeout(() => {
      this.loadData(event)
    }, 400);
  }
  shareVia(socialMedia, claim) {
    switch (socialMedia) {
      case 'facebook':
        this.socialSharing.shareViaFacebook(claim)
        break;
      case 'twitter':
        this.socialSharing.shareViaTwiter(claim)
        break;
      case 'whatsapp':
        this.socialSharing.shareViaWhatsApp(claim)
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
              this.socialSharing.shareViaSMS(claim, reciver)
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
              this.socialSharing.shareViaEmail(claim, reciver)
            }
          }, "Cancel"]
        }).then(alert => alert.present())

        break;

      default:
        break;
    }
  }
  secialStyleForImages(name) {
    name = name.substring(16, name.length - 4)
    switch (name) {
      case 'structure':
        return '20%';
      case 'green':
        return '10%';
      case 'light':
        return '10%';
      case 'trash':
        return '40%';
      case 'parking':
        return '25%';
      case 'road':
        return '25%';
      case 'sink':
        return '10%';
      case 'structure':
        return '20 %';
      case 'illigal':
        return '0%';
      default:
        return 'unset';
    }
  }
  reformSubject(subject: string) {
    let limit = 10
    if (subject.length > limit)
      return subject.substring(0, limit) + '...'
    else
      return subject
  }
  ShowSingleClaim(claim) {
    this.router.navigate(["/single-claim-page"], {
      queryParams: { p: JSON.stringify(claim), claimYLocation: this.ScrollY },
    })
  }
  loadData(event?) {
    this.http.getData().subscribe(d => {
      this.showSkeleton = false;

      this.claims = d;
      let i = -1;
      this.claims.forEach(claim => {
        i++;
        if (event) {
          event.target.complete();
          this.showSkeleton = false
        }
        this.storage.get(this.likedClaimsKey).then(e => {
          this.likedClaims = e;
          let exist = false;
          if (this.likedClaims)
            this.likedClaims.forEach(element => {
              if (claim.id == element) {
                exist = true;
              }
            });
          if (exist)
            claim.state = 'heart'
          else
            claim.state = 'heart-outline'
        })
        this.storage.get(this.notWantedClaimKey).then(e => {
          this.notWantedClaims = e;
          let exist = false;
          if (this.notWantedClaims)
            this.notWantedClaims.forEach(element => {
              if (claim.id == element) {
                exist = true;
              }
            });
          if (exist) {
            this.claims.splice(i, 1)
            i--
          }
        })
      });

      this.claims.forEach(elm => {
        if ((String)(elm.image[0]).indexOf("./assets") > 0)
          elm.noImage = true;
        else
          elm.noImage = false
      });
      this.storage.get('ClientFavDisplayFactor').then(e => {
        this.claims = this.oxClaims;
        this.selectCat.nativeElement.value = e;
        if (e == "Newest") {
          this.claims = this.claims.sort((a, b) => -Number(this.dateToNumber(a.created_at)) + Number(this.dateToNumber(b.created_at)))
        } else if (e == "Hotest") {
          this.claims = this.claims.sort((a, b) => b.upvote - a.upvote)
        }
        else if (e == "Mine") {
          this.storage.get("uuid").then(id => {
            this.claims = this.claims.filter(claim => {
              if (id == claim.uid) {
                return true;
              }
            })
          })
        }
      })

      this.oxClaims = this.claims;
      if (this.claims.length == 0) {
        this.presentPopover({
          bigImage: './assets/images/nodata.png',
          content: 'No Claims !',
          role: "GoToWelcomePage"
        })
      }
    }, err => {
      this.showSkeleton = false;
      this.presentPopover({
        bigImage: './assets/images/nodata.png',
        content: 'You Are in offline mode you Cant see Claims !',
        role: "GoToWelcomePage"
      });
    })
  }

  addToNotWantedClaims(claim) {
    this.claimWithReportOn = null
    if (!this.notWantedClaims)
      this.notWantedClaims = []
    this.notWantedClaims.push(claim.id)
    this.storage.set(this.notWantedClaimKey, this.notWantedClaims)
    this.loadData();
  }
  reportClaim(claim) {
    this.addToNotWantedClaims(claim);
    this.http.getData().subscribe(res => {
      let d: any = res;
      d.forEach(element => {
        if (element.id == claim.id) {
          claim.report = Number(element.report) + 1;
          claim.report += "";
          this.http.updateReport(claim).subscribe()
        }
      });
    })

  }

}
