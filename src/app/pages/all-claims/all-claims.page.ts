import { Component, OnInit } from '@angular/core';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { PopoverController } from '@ionic/angular';
import { NetworkService } from 'src/app/services/network/network.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-all-claims',
  templateUrl: './all-claims.page.html',
  styleUrls: ['./all-claims.page.scss'],
})
export class AllClaimsPage implements OnInit {

  likedClaimsKey = 'likedClaimsKey'
  likedClaims: any = [];
  claims: any = [];
  oxClaims: any = [];
  searchBar = "";
  Online;
  showSkeleton = true;
  cssProp = { // data for css animations
    backGroundTop: "30%",
    textOpacity: 1,
    titleLeft: "10%",
    titleTop: "90%",
    titleSize: "30px",
    textTop: "16%"
  }
  constructor(private sanitizer: DomSanitizer,
    private network: Network,
    public http: HttpClaimService,
    private router: Router,
    private popOver: PopoverController,
    private networkService: NetworkService,
    private storage: Storage) {
    this.likedClaims = []
    this.Online = networkService.isConnected() ? true : false
    if (this.Online)
      this.http.getData().subscribe(d => {
        this.claims = d;
        this.storage.get(this.likedClaimsKey).then(e => {
          this.likedClaims = e;
          this.claims.forEach(claim => {
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

        });

        this.showSkeleton = false;
        this.claims.forEach(elm => {
          if ((String)(elm.image[0]).indexOf("./assets") > 0)
            elm.noImage = true;
          else
            elm.noImage = false
        });

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

  filterList(evt) {
    this.searchBar = evt.srcElement.value;
    const searchTerm = evt.srcElement.value;
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

    if (defDyear > 0) return defDyear + " Years Ago";
    if (defDmounth > 0) return defDmounth + " Months Ago ";
    if (defDDay > 0) return defDDay + " Days Ago ";
    if (defHour > 2) return defHour + " Hours";
    if (defHour > 0) return defHour + " Hours And " + defMinutes + " Minutes Ago ";
    if (defMinutes <= 0) return "Just Now !";
    else
      return defMinutes + " Minutes Ago ";

  }
  ngOnInit() {
  }
  forward() {
    this.router.navigate(["/welcome"]);
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
            console.log('succ');

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
  logScrollStart(ev) { // animations
    let top = ev.detail.scrollTop;
    this.cssProp.backGroundTop = this.map(top, 0, 150, 0, 20)
    this.cssProp.backGroundTop = 30 - Number(this.cssProp.backGroundTop) + "%"
    this.cssProp.textOpacity = this.map(top, 0, 110, 0, 1);
    this.cssProp.textOpacity = 1 - this.cssProp.textOpacity;
    this.cssProp.titleSize = this.map(top, 0, 150, 30, 25) + "px";
    this.cssProp.titleTop = this.map(top, 0, 150, 90, 25) + "%";
    this.cssProp.titleLeft = this.map(top, 0, 150, 10, 17) + "% ";
    this.cssProp.textTop = this.map(top, 0, 150, 16, 12) + "%";
  }
  map(x, in_min, in_max, out_min, out_max) {
    if (x < in_min)
      x = in_min
    else if (x > in_max)
      x = in_max
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

}
