import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Platform, PopoverController } from '@ionic/angular';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { SpamControllerService } from 'src/app/services/spamController/spam-controller.service';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { NetworkService } from 'src/app/services/network/network.service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  Online = false;
  subscription: any;
  splash = true;
  claims: any = [];
  slideOptsOne = {
    slidesPerView: 1,
    autoplay: true,
    initialSlide: 0,
    loop: true,
    autoplayDisableOnInteraction: false
  }

  data = {
    type: "",
    email: "",
    city: "",
    municipalite: "",
    lat: 0,
    lng: 0,
    image: "",
    subject: "",
    description: "",
    uid: ""
  }

  constructor(
    public uid: UniqueDeviceID,
    public router: Router,
    private route: ActivatedRoute,
    private http: HttpClaimService,
    private popOver: PopoverController,
    private spamController: SpamControllerService,
    private networkService: NetworkService) {
    this.route.queryParams.subscribe((res) => {
      if (res.p) {
        this.splash = false;
        this.data = JSON.parse(res.p);
      }
    });

    this.Online = networkService.isConnected() ? true : false
    //this.Online = true;
    if (this.Online)
      this.http.getData().subscribe(data => {
        this.claims = data;
        this.splash = false;
      }, error => {
        this.splash = false;
        this.presentPopover({
          content: "Server is down would you like to continue ?",
          bigImage: 'assets/images/offline.png',
          button: 'Yes'
        })
      });
    else {
      this.splash = false;
      this.presentPopover({
        content: "You are in Offline Mode would you like to continue ?",
        bigImage: 'assets/images/offline.png',
        button: 'Yes'
      })
    }

  }

  ngOnInit() {
    if (!this.data.uid || this.data.uid == '')
      this.uid.get()
        .then((uuid: any) => this.data.uid = uuid)
        .catch((error: any) => this.data.uid = error);

  }

  seeClaims() {
    this.router.navigate(["/all-claims"]);
  }

  slideChanged(slides) {
    slides.startAutoplay();
  }

  changed(slides) {
    slides.startAutoplay();
  }

  forward() {
    let Time = this.spamController.checkForSpam(this.data.uid, JSON.parse(JSON.stringify(this.claims)));
    if (Time != -1) {
      let cont;
      if (Time == 0) {
        cont = {
          content: "Oops ! Sorry For that. We are unable to process any more request at this moment, Please try again after one hour",
          bigImage: 'assets/images/spam.png'
        }
      } else {
        cont = {
          content: "Oops ! Sorry For that. We are unable to process any more request at this moment, Please try again after " + Time + " Hours ",
          bigImage: 'assets/images/spam.png'
        }
      }

      this.presentPopover(cont);
    }
    else {
      this.router.navigate(["/type-de-reclamation"], {
        queryParams: { p: JSON.stringify(this.data) },
      })
    }

  }
  AboutUs() {
    this.router.navigate(["/about-us"], {
      queryParams: { p: JSON.stringify(this.data) },
    })
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

}
