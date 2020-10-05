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
import { LanguageServiceService } from 'src/app/services/languageService/language-service.service';
import { take } from 'rxjs/operators';

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
  welcome: any = { a: "together!", b: "tunisia better" };
  firstTimeApp = false;
  slideOptsOne = {
    slidesPerView: 1,
    autoplay: true,
    initialSlide: 0,
    loop: true
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
    private storage: Storage,
    private languageService: LanguageServiceService) {
    this.route.queryParams.subscribe((res) => {
      if (res.p) {
        this.splash = false;
        this.data = JSON.parse(res.p);
      }
    });


    this.storage.get("firstTimeApp").then(res => {
      this.firstTimeApp = (res != "false")
    });
    this.Online = networkService.getCurrentNetworkStatus() == ConnectionStatus.Online ? true : false
    if (this.Online)
      this.http.getData().subscribe(data => {
        this.claims = data;
        this.splash = false;
      }, error => {
        this.splash = false;
        this.presentPopover({
          content: this.translate.instant("WELCOME.ALERTS.serverProb"),
          bigImage: 'assets/images/offline.png',
          button: this.translate.instant("WELCOME.ALERTS.buttons")
        })
      });
    else {
      this.splash = false;
      this.presentPopover({
        content: this.translate.instant("WELCOME.ALERTS.offline"),
        bigImage: 'assets/images/offline.png',
        button: this.translate.instant("WELCOME.ALERTS.buttons")
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
            content: this.translate.instant("WELCOME.ALERTS.spam0"),
            bigImage: 'assets/images/spam.png'
          }
        } else {
          cont = {
            content: this.translate.instant("WELCOME.ALERTS.spam1", { Time }),
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
  setLanguage(lang) {
    this.firstTimeApp = false;
    this.storage.set('firstTimeApp', "false");
    this.languageService.setLanguage(lang);
    if (lang == "en")
      this.welcome = { a: "Together !", b: "Tunisia better" };
    else
      this.welcome = { a: "Ensemble !", b: "Tunisie mieux" }
  }
  ionViewWillEnter() {
    let lag = this.translate.currentLang;
    console.log(lag);

    if (lag == "en")
      this.welcome = { a: "Together !", b: "Tunisia better" };
    else
      this.welcome = { a: "Ensemble !", b: "Tunisie mieux" }
  }
}
