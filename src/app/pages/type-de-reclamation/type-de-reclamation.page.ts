import { Component, OnInit } from '@angular/core';
import { AlertController, PopoverController, Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { element } from 'protractor';
import { ConnectionStatus } from 'src/app/services/network/network.service';
import { EMLINK } from 'constants';

@Component({
  selector: 'app-type-de-reclamation',
  templateUrl: './type-de-reclamation.page.html',
  styleUrls: ['./type-de-reclamation.page.scss'],
})
export class TypeDeReclamationPage implements OnInit {
  ngOnInit(): void {
  }
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
    uid: ""
  }
  Online;
  types: Array<Object> = [
    {
      name: "Public", image: "./assets/logos/green.png", color: "white", content: "Select this Option if there is any thing related to green spaces",
      bigImage: './assets/images/green.png', titleColor: "#8c8c8c"
    },
    {
      name: "ligth", image: "./assets/logos/ligth.png", color: "white", content: "Select this Option if there is Some thing wrong in our Lighting system",
      bigImage: './assets/images/light.png', titleColor: "#8c8c8c"
    },
    {
      name: "trash", image: "./assets/logos/trash.png", color: "white", content: "Select this Option every ench in Tunisia And obvsiouly we aint coming",
      bigImage: './assets/images/trash.png', titleColor: "#8c8c8c"
    },
    {
      name: "illigal", image: "./assets/logos/structure.png", color: "white", content: "Select this option when ever you see any type of street Vendors And we will be happy to ruin their lives ",
      bigImage: './assets/images/illigal.png', titleColor: "#8c8c8c"
    },
    {
      name: "structure", image: "./assets/logos/struct.png", color: "white", content: "ht",
      bigImage: './assets/images/structure.png', titleColor: "#8c8c8c"
    },
    {
      name: "parking", image: "./assets/logos/parking.png", color: "white", content: "hth",
      bigImage: './assets/images/parking.png', titleColor: "#8c8c8c"
    },
    {
      name: "sink", image: "./assets/logos/sink.png", color: "white", content: "aze",
      bigImage: './assets/images/sink.png', titleColor: "#8c8c8c"
    },
    {
      name: "Patholes", image: "./assets/logos/roades.png", color: "white", content: "n",
      bigImage: './assets/images/road.png', titleColor: "#8c8c8c"
    }
  ];
  constructor(private popOver: PopoverController,
    public alert: AlertController,
    public router: Router,
    private route: ActivatedRoute,
    private platform: Platform) {
    this.route.queryParams.subscribe((res) => {
      this.data = JSON.parse(res.p);
      console.log(this.data);
    });
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
        console.log();

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
    console.log(type);
    return await popover.present();
  }

  async customType(message) {
    const alert = await this.alert.create({
      header: 'nouveau type',
      inputs: [{
        name: 'customType',
        type: 'text',
        label: 'your type',
        value: ''
      },],
      message: message || 'donner le type de la reclamation',
      buttons: [{
        text: "ok",
        handler: (value) => {
          this.data.type = value.customType;
          if (this.data.type !== "")
            this.router.navigate(["/information-personnel"], {
              queryParams: { p: JSON.stringify(this.data) },
            })
          else
            this.customType("le type de reclamation est obligatoire");
        }
      }, "Cancel"]

    });

    await alert.present();
  }


  backward() {
    this.router.navigate(["/welcome"], {
      queryParams: { p: JSON.stringify(this.data) },
    })
  }
  forward() {
    if (this.checkDataEmpty())
      this.router.navigate(["/information-personnel"], {
        queryParams: { p: JSON.stringify(this.data) },
      })
    else {
      this.presentPopover(null, { bigImage: "assets/images/spam.png", content: "sorry You Have To chose one Option From abouve" })
    }
  }
  checkDataEmpty() {
    if (this.data.type != "" && this.data != null)
      return true;
    return false;
  }
  logScrollStart(ev) {
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
  pressEvent(e) {
    console.log("e");
  }
}
