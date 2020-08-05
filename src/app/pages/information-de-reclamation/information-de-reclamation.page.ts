import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Platform, PopoverController } from '@ionic/angular'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { FileChooser } from '@ionic-native/file-chooser/ngx'
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { Observable } from 'rxjs';
import { Base64 } from '@ionic-native/base64';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { ConnectionStatus, NetworkService } from 'src/app/services/network/network.service';
declare var nsfwCheck: Function;

@Component({
  selector: 'app-information-de-reclamation',
  templateUrl: './information-de-reclamation.page.html',
  styleUrls: ['./information-de-reclamation.page.scss'],
})

export class InformationDeReclamationPage implements OnInit {
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
    upvote: 0
  }
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
  types: Array<any> = [
    {
      name: "Public", bigImage: './assets/images/green.png'
    },
    {
      name: "light", bigImage: './assets/images/light.png'
    },
    {
      name: "trash", bigImage: './assets/images/trash.png'
    },
    {
      name: "illigal", bigImage: './assets/images/illigal.png'
    },
    {
      name: "structure", bigImage: './assets/images/structure.png'
    },
    {
      name: "parking", bigImage: './assets/images/parking.png'
    },
    {
      name: "sink", bigImage: './assets/images/sink.png'
    },
    {
      name: "Patholes", bigImage: './assets/images/illigal.png'
    }
  ];
  constructor(public router: Router,
    public http: HttpClaimService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private camera: Camera,
    private fileChooser: FileChooser,
    private popOver: PopoverController,
    private platform: Platform,
    private networkService: NetworkService) {

    this.route.queryParams.subscribe((res) => {
      this.data = JSON.parse(res.p);
      let ty: any = this.types.filter(elm => {
        if (elm.name == this.data.type) {
          return true;
        }
      })
      console.log(ty);

      this.data.image = ty[0].bigImage;
    });

    this.Online = networkService.isConnected() ? true : false
    this.platform.backButton.subscribe(() => {
      this.backward();
    });

  }

  ngOnInit() {
  }




  cameraOptions(sourceType) {
    let options: CameraOptions = {
      quality: 50,
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
      nsfwCheck(imageData)
      setTimeout(() => {
        if (this.nsfw == 'nsfw') {
          this.presentPopover(null, {
            bigImage: "assets/images/nsfw.png", content: "استغفر الله ... احشم يا خرا"
          })
        } else {
          this.data.image = 'data:image/jpeg;base64,' + imageData;
        }
      }, 2000);
    }, (err) => {
      let ty: any = this.types.filter(elm => {
        if (elm.name == this.data.type) return true;
      })
      this.data.image = ty[0].bigImage;
    });
  }
  getImgContent(image: string): any {
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
      nsfwCheck(imageData);
      setTimeout(() => {
        if (this.nsfw == 'nsfw') {
          this.presentPopover(null, {
            bigImage: "assets/images/spam.png", content: "NSFW"
          })
        } else {
          this.data.image = 'data:image/jpeg;base64,' + imageData;
        }
      }, 2000);
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
      this.http.postData(this.data).subscribe(inf => {
        if (this.Online)
          this.presentPopover(null, {
            bigImage: "assets/images/success.png",
            content: "Your Claim has been Completed Successfully",
            role: "GoToWelcomePage"
          });
        else
          this.presentPopover(null, {
            bigImage: "assets/images/success.png",
            content: "Your Claim has been Successfully stored in your device It will be send when you are reconnect to network !",
            role: "GoToWelcomePage"
          });
        this.spinner = false;
      }, err => {
        console.log(err)
      })


    }
    else {
      this.presentPopover(null, { bigImage: "assets/images/spam.png", content: "sorry Description and Subjet are required" })
    }
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
