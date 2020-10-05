import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ActionSheetController, Platform, PopoverController, IonContent } from '@ionic/angular'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { FileChooser } from '@ionic-native/file-chooser/ngx'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { Observable } from 'rxjs';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { ConnectionStatus, NetworkService } from 'src/app/services/network/network.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { TranslateService } from '@ngx-translate/core';
declare var nsfwCheck: Function;

@Component({
  selector: 'app-information-de-reclamation',
  templateUrl: './information-de-reclamation.page.html',
  styleUrls: ['./information-de-reclamation.page.scss'],
})

export class InformationDeReclamationPage implements OnInit {
  @ViewChild('IonContent', { static: false }) IonContent: IonContent;

  spinner = false;
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
    uid: "",
    upvote: 0,
    report: 0
  }
  imageType = "png";
  nsfw;
  cssProp = { // data for css animations
    backGroundTop: "30%",
    textOpacity: 1,
    titleLeft: "10%",
    titleTop: "90%",
    titleSize: "30px",
    textTop: "16%"
  }
  result: Observable<any>
  Online;
  types: Array<any>;
  ScrollY: number;
  scrolling: boolean;
  handledInTouchEnd: boolean = true;
  isTouched: boolean;
  @HostListener('keydown', ['$event'])
  keyEvent(e) {
    var code = e.keyCode || e.which;
    //log.d( "HostListener.keyEvent() - code=" + code );
    if (code === 13) {
      // log.d( "e.srcElement.tagName=" + e.srcElement.tagName );
      if (e.srcElement.tagName === "INPUT") {
        //log.d( "HostListener.keyEvent() - here" );
        e.preventDefault();

        this.keyboard.hide();
      }
    }
  };
  constructor(public router: Router,
    public http: HttpClaimService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private camera: Camera,
    private fileChooser: FileChooser,
    private popOver: PopoverController,
    private platform: Platform,
    private keyboard: Keyboard,
    private networkService: NetworkService,
    private translate: TranslateService) {

    this.route.queryParams.subscribe((res) => {
      this.data = JSON.parse(res.p);
      this.types = this.translate.instant("TYPEDERECLAMATION.types")
      let ty: any = this.types.filter(elm => {
        if (elm.name == this.data.type) {
          return true;
        }
      })

      this.data.image = ty[0].bigImage;
    });

    // detecting the network state
    this.Online = networkService.getCurrentNetworkStatus() == ConnectionStatus.Online ? true : false

    this.platform.backButton.subscribe(() => {
      this.backward();
    });
  }

  ngOnInit() {

  }




  cameraOptions(sourceType) {
    let options: CameraOptions = {
      quality: 500,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      allowEdit: false,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 400,
      targetWidth: 400,
    }

    return options;
  }

  loadCamera() {
    let cameraOptions = this.cameraOptions(this.camera.PictureSourceType.CAMERA);
    this.camera.getPicture(cameraOptions).then(async (imageData) => {
      this.imageType = 'base64'
      if (this.Online) {
        nsfwCheck(imageData)
        setTimeout(() => {
          if (this.nsfw == 'nsfw') {
            this.presentPopover(null, {
              bigImage: "assets/images/nsfw.png",
              content: this.translate.instant("INFREC.ALERTS.NSFW")
            })
          } else {
            this.data.image = 'data:image/jpeg;base64,' + imageData;
          }
        }, 2000);
      } else
        this.data.image = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      let ty: any = this.types.filter(elm => {
        if (elm.name == this.data.type) return true;
      })
      this.data.image = ty[0].bigImage;
    });
  }
  getImgContent(image: string): any {
    // return 'https://citynews.com.au/wp-content/uploads/2020/03/Manuka-tree-500x482.jpg'
    if (image == './assets/images/NoImage.jpeg' || image == '')
      return './assets/images/NoImage.jpg'
    else {
      let x: SafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(image);
      return x;
    }
  }

  loadFileChooser() {

    let cameraOptions = this.cameraOptions(this.camera.PictureSourceType.PHOTOLIBRARY);
    this.camera.getPicture(cameraOptions).then(async (imageData) => {
      this.imageType = 'base64'
      if (this.Online) {
        nsfwCheck(imageData)
        setTimeout(() => {
          if (this.nsfw == 'nsfw') {
            this.presentPopover(null, {
              bigImage: "assets/images/nsfw.png", content: "NSFW"
            })
          } else {
            this.data.image = 'data:image/jpeg;base64,' + imageData;
          }
        }, 2000);
      }
      else
        this.data.image = 'data:image/jpeg;base64,' + imageData

    }, (err) => {
      let ty: any = this.types.filter(elm => {
        if (elm.name == this.data.type) return true;
      })
      this.data.image = ty[0].bigImage;
    });

  }


  backward() {
    this.router.navigate(["/information-personnel"], {
      queryParams: { p: JSON.stringify(this.data) },
    })
  }

  checkDataEmpty() {
    if (this.data.subject !== "" && this.data.description !== "")
      return true;
    return false;
  }
  submit() {
    if (this.checkDataEmpty()) {
      this.spinner = true;
      this.data.upvote = 0;
      this.data.report = 0;
      if (this.imageType != 'base64') {
        this.postClaim()
      } else {

        this.http.uploadImage(this.data).subscribe(inf => {
          let image: any = inf;
          this.data.image = image.data.link;
          this.postClaim()
        }, err => {
          console.log(err);
        })
      }
    }
    else {
      this.presentPopover(null, {
        bigImage: "assets/images/spam.png",
        content: this.translate.instant("INFREC.ALERTS.fieldRequired")
      })
    }
  }
  postClaim() {
    if (!this.Online) {
      this.http.postData(this.data)
      this.spinner = false
      this.presentPopover(null, {
        bigImage: "assets/images/success.png",
        content: this.translate.instant("INFREC.ALERTS.offlineSucc"),
        role: this.translate.instant("INFREC.ALERTS.buttons.route"),
        button: this.translate.instant("INFREC.ALERTS.buttons.route"),
      });
    }
    else
      this.http.postData(this.data).subscribe(inf => {
        this.presentPopover(null, {
          bigImage: "assets/images/success.png",
          content: this.translate.instant("INFREC.ALERTS.onlineSucc"),
          role: this.translate.instant("INFREC.ALERTS.buttons.route"),
          button: this.translate.instant("INFREC.ALERTS.buttons.route"),
        });
        this.spinner = false;
      }, err => {
        this.spinner = false;
        this.presentPopover(null, {
          bigImage: "assets/images/spam.png",
          content: this.translate.instant("INFREC.ALERTS.generalError"),
          role: this.translate.instant("INFREC.ALERTS.buttons.ok")
        });
      })
  }

  async presentPopover(ev: any, type: any) {
    const popover = await this.popOver.create({
      component: PopoverComponentComponent,
      event: ev,
      componentProps: type,
      translucent: true,
      animated: true,
      backdropDismiss: false
    });
    return await popover.present();
  }
  touchstart() {
    this.isTouched = true;
  }
  touchend() {
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
  startScroll() {
    if (this.isTouched)
      this.scrolling = true
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
  }
  map(x, in_min, in_max, out_min, out_max) {
    if (x < in_min)
      x = in_min
    else if (x > in_max)
      x = in_max
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  maxLetters(n) {
    if (this.data.subject.length > n)
      this.data.subject = this.data.subject.slice(0, n)
  }
}
