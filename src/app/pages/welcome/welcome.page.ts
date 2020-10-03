import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Platform, PopoverController } from '@ionic/angular';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { SpamControllerService } from 'src/app/services/spamController/spam-controller.service';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { NetworkService, ConnectionStatus } from 'src/app/services/network/network.service';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

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
    private platform: Platform,
    private popOver: PopoverController,
    private spamController: SpamControllerService,
    private networkService: NetworkService,
    private splashScreen: SplashScreen,
    private translate: TranslateService,
    private storage: Storage) {
    this.route.queryParams.subscribe((res) => {
      if (res.p) {
        this.splash = false;
        this.data = JSON.parse(res.p);
      }
    });


    this.Online = networkService.getCurrentNetworkStatus() == ConnectionStatus.Online ? true : false
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
    this.platform.ready().then(() => {
      this.uid.get().then(value => {
        this.storage.get("uuid").then(e => {
          if (!e)
            this.storage.set("uuid", value)
        }).catch(() => {
          this.storage.set("uuid", value)
        })
        this.data.uid = value
      }).catch(error => {
        this.data.uid = error
      })
    });
  }

  ngOnInit() {
    this.splashScreen.hide();
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
    this.Online = this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online ? true : false

    if (this.Online && this.claims != []) {
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
      } else {
        this.router.navigate(["/type-de-reclamation"], {
          queryParams: { p: JSON.stringify(this.data) },
        })
      }

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
