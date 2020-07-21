import { Component, OnInit } from '@angular/core';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { Router } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { PopoverController } from '@ionic/angular';
import { NetworkService } from 'src/app/services/network/network.service';

@Component({
  selector: 'app-all-claims',
  templateUrl: './all-claims.page.html',
  styleUrls: ['./all-claims.page.scss'],
})
export class AllClaimsPage implements OnInit {

  claims: any = [];
  oxClaims: any = [];
  searchBar = "";
  Online;
  showSkeleton = true;
  constructor(private sanitizer: DomSanitizer,
    private network: Network,
    public http: HttpClaimService,
    private router: Router,
    private popOver: PopoverController,
    private networkService: NetworkService) {
    this.Online = networkService.isConnected() ? true : false
    if (this.Online)
      this.http.getData().subscribe(d => {
        this.claims = d;
        this.showSkeleton = false;
        this.claims.forEach(elm => {
          elm.upvote = 0
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
        elm.upvote++;
        return;
      }
    });
  }
  downvote(claim) {
    this.claims.forEach(elm => {
      if (elm.id == claim.id) {
        elm.upvote--;
        return;
      }
    });
  }
}
