import { Component, OnInit, ViewChildren, ElementRef, Query, QueryList, AfterViewInit, ViewChild } from '@angular/core';
import { AlertController, PopoverController, Platform, IonCard, IonContent } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { element } from 'protractor';
import { ConnectionStatus } from 'src/app/services/network/network.service';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

const firstTimeTR = 'firstTimeTR'
@Component({
  selector: 'app-type-de-reclamation',
  templateUrl: './type-de-reclamation.page.html',
  styleUrls: ['./type-de-reclamation.page.scss'],
})
export class TypeDeReclamationPage implements AfterViewInit {
  @ViewChild('IonContent', { static: false }) IonContent: IonContent;

  cssProp = {
    backGroundTop: "30%",
    textOpacity: 1,
    titleLeft: "10%",
    titleTop: "90%",
    titleSize: "30px",
    textTop: "16%",
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
    uid: "",
    report: 0
  }
  Online;
  ScrollY;
  elmntOntouch = false;
  scrolling: boolean;
  handledInTouchEnd: boolean = true;
  isTouched: boolean;
  types: any;
  constructor(private popOver: PopoverController,
    public alert: AlertController,
    public router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
    private storage: Storage,
    private translate: TranslateService) {
    this.route.queryParams.subscribe((res) => {
      this.data = JSON.parse(res.p);
    });
    this.types = this.translate.instant("TYPEDERECLAMATION.types")

    this.Online = ConnectionStatus.Online ? true : false
    this.cssProp.backGroundTop = "30%";
    this.platform.backButton.subscribe(() => {
      this.backward();
    });
  }
  changeType(obj) {
    this.data.type = obj.name;
    this.types.forEach((element: any) => {
      if (element.color == "#feb797") {
        element.image = element.image.substring(0, element.image.length - 5) + ".png"
        element.color = 'white';
        element.titleColor = "#8c8c8c";
      }
    })
    let x: any = this.types[this.types.indexOf(obj)];
    this.types[this.types.indexOf(obj)] = {
      name: x.name,
      image: x.image.substring(0, x.image.length - 4) + "W.png",
      content: x.content,
      color: "#feb797",
      titleColor: "white",
      bigImage: x.bigImage
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

  ngAfterViewInit() {
    this.storage.get(firstTimeTR).then(res => {
      if (!res) {
        this.storage.set(firstTimeTR, true)
        this.presentPopover(null, {
          bigImage: "assets/images/holdTip.png",
          content: this.translate.instant("TYPEDERECLAMATION.ALERTS.0")
        })
      }

    })
  }
  cardTouchstart(event, el) {
    this.elmntOntouch = true;
    this.showMoreInfo(el)
  }
  cardTouchend() {
    this.elmntOntouch = false;
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
  showMoreInfo(el) {
    setTimeout(() => {
      if (this.elmntOntouch == true)
        this.presentPopover(null, el)
    }, 700);
  }

  async customType(message = null) {

    const alert = await this.alert.create({
      header: this.translate.instant("TYPEDERECLAMATION.custom.head"),
      inputs: [{
        name: 'customType',
        type: 'text',
        label: 'your type',
        value: ''
      },],
      message: '',
      buttons: [{
        text: "ok",
        handler: (value) => {
          this.data.type = value.customType;
          if (this.data.type !== "")
            this.router.navigate(["/information-personnel"], {
              queryParams: { p: JSON.stringify(this.data) },
            })
          else
            this.customType(this.translate.instant("TYPEDERECLAMATION.custom.errorMsg"));
        }
      }, "Cancel"]

    });

    await alert.present();
  }


  backward() {
    this.router.navigate([""], {
      queryParams: { p: JSON.stringify(this.data) },
    })
  }
  forward() {
    if (this.checkDataEmpty())
      this.router.navigate(["/information-personnel"], {
        queryParams: { p: JSON.stringify(this.data) },
      })
    else {
      this.presentPopover(null, {
        bigImage: "assets/images/spam.png",
        content: this.translate.instant("TYPEDERECLAMATION.ALERTS.1")
      })
    }
  }
  checkDataEmpty() {
    if (this.data.type != "" && this.data != null)
      return true;
    return false;
  }
  logScrollStart(ev) {
    this.elmntOntouch = false;
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
}
