/* importing required packages/component/classes... */
import { Component, OnInit, ViewChild, NgZone, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PopoverComponentComponent } from 'src/app/components/popover-component/popover-component.component';
import { Platform, PopoverController, IonContent, } from '@ionic/angular';
import { Validator, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ConnectionStatus, NetworkService } from 'src/app/services/network/network.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { Keyboard } from '@ionic-native/keyboard/ngx';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
/* importing/declaring javascript functions from assets/js  */

declare var map: Function; // function that load the map API
declare var getLatLng: Function; // function that return the Lat and the Lng from the map API
declare var setLatLng: Function; // Function that store the data for training the module (Lat/Lng)
declare var setup: Function; // function that setup the AI environment (loading module/setting labels ...)
declare var getModel: Function; // function that setup the AI environment (loading module/setting labels ...)
declare var changeLabel: Function; // Function that store the data for training the module (city label)
declare var collectData: Function; // function that call training or prediction from the mljs API
declare var train: Function; // setup the code for training 
declare var returnToTs: Function; // setup the code for prediction 


@Component({
  selector: 'app-information-personnel',
  templateUrl: './information-personnel.page.html',
  styleUrls: ['./information-personnel.page.scss'],
})

export class InformationPersonnelPage implements OnInit {

  /*declaring the class variables */
  Module: any; // variable that store the module data while training
  splash = true; // variable that hide or show the loading screen 
  Online; // variable that store either the device is connected or not 
  clickByMouse = false; // variable used in some in-depth algorithme 
  scrolling: boolean;
  handledInTouchEnd: boolean = true;
  isTouched: boolean;
  cityBeforeChanged = '';
  changedByMuni = false; // variable used in some in-depth algorithme 
  muni = []; // table that store the list of municipalities for the selected city 
  data = { // global data of claim
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

  cssProp = { // data for css animations
    backGroundTop: "30%",
    textOpacity: 1,
    titleLeft: "10%",
    titleTop: "90%",
    titleSize: "30px",
    textTop: "16%"
  }
  ScrollY: Number;
  startScrollY: Number = 0;
  cities = [
    {
      c: "Tunis", m: [
        "tunis",
        "Le Bardo",
        "Le Kram",
        "La Goulette",
        "Carthage",
        "Sidi Bou Said",
        "La Marsa",
        "Sidi Hassine"]
    },
    {
      c: "Ariana", m: [
        "ariana",
        "La Soukra",
        "Raoued",
        "Kalâat el-Andalous",
        "Sidi Thabet	",
        "Ettadhamen-Mnihla"
      ]
    },
    {
      c: "Zaghouan Governorate", m: [
        "Zaghouan",
        "Zriba",
        "Bir Mcherga",
        "Djebel Oust",
        "El Fahs",
        "Nadhour"
      ]
    },
    {
      c: "Béja", m: [
        "Beja",
        "El Maâgoula",
        "Zahret Medien",
        "Nefza",
        "Teboursouk",
        "Testour",
        "Goubellat",
        "Majaz al Bab"
      ]
    },
    {
      c: "Ben Arous", m: [
        "benarous",
        "El Mourouj",
        "Hammam Lif",
        "Hammam Chott",
        "Bou Mhel el-Bassatine",
        "Ezzahra",
        "Radès	",
        "Mégrine",
        "Mohamedia-Fouchana",
        "Mornag	",
        "Khalidia"
      ]
    },
    {
      c: "Manouba", m:
        ["Den Den",
          "Douar Hicher",
          "Oued Ellil",
          "Mornaguia",
          "Borj El Amri",
          "Djedeida",
          "Tebourba",
          "El Battan"]
    },
    {
      c: "Nabeul", m: ["Dar Chaabane",
        "Béni Khiar",
        "El Maâmoura	",
        "Somâa",
        "Korba",
        "Tazerka",
        "Menzel Temime",
        "Menzel Horr",
        "El Mida",
        "Kelibia	",
        "Azmour	",
        "Hammam Ghezèze",
        "Dar Allouch	",
        "El Haouaria",
        "Takelsa	",
        "Soliman",
        "Korbous	",
        "Menzel Bouzelfa",
        "Béni Khalled",
        "Zaouiet Djedidi	",
        "Grombalia	",
        "Bou Argoub",
        "Hammamet	",
        "Zriba",
        "Bir Mcherga",
        "Djebel Oust	",
        "El Fahs	",
        "Nadhour"]
    },
    {
      c: "Bizerte", m: ["Bizerte",
        "Sejnane",
        "Mateur",
        "Menzel Bourguiba",
        "Tinja",
        "Ghar al Milh",
        "Aousja",
        "Menzel Jemil",
        "Menzel Abderrahmane	",
        "El Alia	",
        "	Ras Jebel",
        "Metline",
        "Raf Raf	"
      ]
    },
    {
      c: "Jendouba", m: ["Jendouba",
        "Bou Salem",
        "Tabarka",
        "Aïn Draham",
        "Fernana",
        "Beni M'Tir",
        "Ghardimaou",
        "Oued Melliz"]
    },
    {
      c: "Al Kaf", m: ["Kef",
        "Nebeur",
        "Touiref",
        "Sakiet Sidi Youssef",
        "Tajerouine",
        "Menzel Salem",
        "Kalaat es Senam	",
        "Kalâat Khasba",
        "Jérissa",
        "El Ksour",
        "Dahmani",
        "Sers"]
    },
    {
      c: "Siliana", m: ["Siliana",
        "Bou Arada",
        "Gaâfour",
        "El Krib",
        "Sidi Bou Rouis",
        "Maktar",
        "Rouhia",
        "Kesra",
        "Bargou",
        "El Aroussa"]
    },
    {
      c: "Sousse", m: ["Sousse",
        "Ksibet Thrayet",
        "Ezzouhour",
        "Zaouiet Sousse",
        "Hammam Sousse",
        "Akouda",
        "Kalâa Kebira",
        "Sidi Bou Ali",
        "Hergla",
        "Enfidha",
        "Bouficha",
        "Sidi El Hani",
        "M'saken",
        "Kalâa Seghira",
        "Messaadine",
        "Kondar"]
    },
    {
      c: "Monastir", m: ["Monastir",
        "Khniss",
        "Ouerdanin",
        "Sahline Moôtmar",
        "Sidi Ameur",
        "Zéramdine	",
        "Beni Hassen",
        "Ghenada",
        "Jemmal",
        "Menzel Kamel",
        "Zaouiet Kontoch",
        "Bembla-Mnara",
        "Menzel Ennour",
        "El Masdour",
        "Moknine",
        "Sidi Bennour",
        "Menzel Farsi	",
        "Amiret El Fhoul",
        "Amiret Touazra",
        "Amiret El Hojjaj ",
        "Cherahil",
        "Bekalta",
        "Téboulba",
        "Ksar Hellal",
        "Ksibet El Mediouni",
        "Benen Bodher",
        "Touza",
        "Sayada",
        "Lemta",
        "Bouhjar",
        "Menzel Hayet"]
    },
    {
      c: "Mahdia", m: ["Mahdia",
        "Rejiche",
        "Bou Merdes",
        "Ouled Chamekh",
        "Chorbane",
        "Hebira",
        "Essouassi",
        "El Djem	",
        "Kerker",
        "Chebba",
        "Melloulèche",
        "Sidi Alouane",
        "Ksour Essef",
        "El Bradâa"]
    },
    {
      c: "Sfax", m: ["Sfax",
        "Sakiet Ezzit",
        "Chihia",
        "Sakiet Eddaïer",
        "Gremda",
        "El Ain",
        "Thyna",
        "Agareb",
        "Jebiniana",
        "El Hencha",
        "Menzel Chaker",
        "Ghraïba ",
        "Bir Ali Ben Khélifa",
        "Skhira",
        "Mahares",
        "Kerkennah"]
    },
    {
      c: "Kairouan", m: ["Kairouan",
        "Chebika",
        "Sbikha",
        "Oueslatia",
        "Aïn Djeloula",
        "Haffouz",
        "Alaâ",
        "Hajeb El Ayoun",
        "Nasrallah",
        "Menzel Mehiri",
        "Echrarda",
        "Bou Hajla"]
    },
    {
      c: "Kasserine", m: ["Kasserine",
        "Sbeitla",
        "Sbiba",
        "Jedelienne",
        "Thala",
        "Haïdra",
        "Foussana",
        "Fériana",
        "Thélepte",
        "Magel Bel Abbès"]
    },
    {
      c: "Sidi Bouzid", m: ["Sidi Bouzid",
        "Jilma",
        "Cebalet",
        "Bir El Hafey",
        "Sidi Ali Ben Aoun",
        "Menzel Bouzaiane",
        "Meknassy ",
        "Mezzouna",
        "Regueb",
        "Ouled Haffouz"]
    },
    {
      c: "Gabès", m: ["Gabès",
        "Chenini Nahal	",
        "Ghannouch",
        "Métouia",
        "Oudhref",
        "El Hamma",
        "Matmata",
        "Nouvelle Matmata",
        "Mareth",
        "Zarat"]
    },
    {
      c: "Médenine", m: ["Mednine",
        "Beni Khedache	",
        "Ben Gardane	",
        "Zarzis",
        "Houmt El Souk (Djerba)",
        "Midoun (Djerba)",
        "Ajim (Djerba)"]
    },
    {
      c: "Tataouine", m: ["Tataouine",
        "Bir Lahmar",
        "Ghomrassen",
        "Dehiba",
        "Remada"]
    },
    {
      c: "Gafsa", m: ["Gafsa",
        "El Ksar",
        "Moularès",
        "Redeyef",
        "Métlaoui",
        "Mdhila",
        "El Guettar ",
        "Sened"]
    },
    {
      c: "Tozeur", m: ["Tozeur",
        "Degache",
        "Hamet Jerid",
        "Nafta",
        "Tamerza"]
    },
    {
      c: "Kébili", m: ["Kebili",
        "Djemna",
        "Douz",
        "El Golâa",
        "Souk Lahad"]
    }

  ]; // table store all the cities + their municipalities
  citiesLat: Array<any>; // table store all the cities + their gloabal lat lng

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
  @ViewChild('IonContent', { static: false }) IonContent: IonContent;
  constructor(private route: ActivatedRoute,
    private platform: Platform,
    public router: Router,
    private popOver: PopoverController,
    private keyboard: Keyboard,
    private networkService: NetworkService,
    private geolocation: Geolocation,
    private http: HttpClaimService) {

    // detecting the network state
    this.Online = networkService.getCurrentNetworkStatus() == ConnectionStatus.Online ? true : false
    this.route.queryParams.subscribe((res) => { // getting data from the previous page
      this.data = JSON.parse(res.p);
    });
    // look up for more informations
    this.splash = true;
    fetch("../../assets/js/tn.json").then(res => res.json()).then(json => {
      this.citiesLat = json;// look up for more informations
      //deactivating the loading screen after loading the heavey data 
    });
    this.clickByMouse = false;
    this.cities.forEach((elm) => {
      elm.m.forEach(munic => {
        this.muni.push(munic);
      });
    })
  }
  changedMuni(event) { // when selecting a municipality
    if (this.clickByMouse)
      return
    this.changedByMuni = true;
    if (event.detail.value.toString().trim() == '')
      return
    const m = event.detail.value.toString().trim();
    this.cities.forEach((elm) => {
      elm.m.forEach(element => {
        if (m == element.toString().trim()) {

          if (this.cityBeforeChanged != elm.c.toString().trim()) {

            this.data.city = elm.c.toString().trim();
            this.cityBeforeChanged = elm.c.toString().trim();
          }
          this.muni = elm.m;
          return;
        }
      });
    })
  }

  changed(event) { // when selecting a city
    if (this.clickByMouse)
      return;
    if (!this.changedByMuni) {
      this.data.municipalite = '';
      this.changedByMuni = false;
    }

    this.cities.forEach(element => {
      if (element.c.toString().trim() == event.detail.value.toString().trim())
        this.muni = element.m;
    });
    if (this.Online && this.cityBeforeChanged != event.detail.value.toString().trim())
      this.citiesLat.forEach(element => {
        if (element.city == event.detail.value.toString().trim()) {
          map([element.lng, element.lat])
          this.data.lng = element.lng
          this.data.lat = element.lat
        }
      });
    this.changedByMuni = false;
  }

  chosenByButton() {
    this.clickByMouse = false;
  }

  backward() { // when routing to the previous page
    this.router.navigate(["/type-de-reclamation"], {
      queryParams: { p: JSON.stringify(this.data) },
    })
  }

  forward() { // when routing to the next page
    //  this.trainModule()
    this.splash = true
    if (this.checkDataEmpty()) {
      this.http.verifyEmail(this.data.email).subscribe(enf => {
        this.splash = false
        let status: any = enf;
        if (status.smtp_log == "Success")
          this.router.navigate(["/information-de-reclamation"], {
            queryParams: { p: JSON.stringify(this.data) },
          })
        else
          this.presentPopover(null, {
            bigImage: "assets/images/spam.png",
            content: "Please enter a valid email"
          })
      })

    }
    else {
      this.presentPopover(null, {
        bigImage: "assets/images/spam.png",
        content: "Sorry E-mail And City Field are required  "
      })
    }
  }

  checkDataEmpty() {
    return this.data.email !== "" && this.data.city !== "";
  }
  ionViewWillEnter() { // loading the map
    let pos;

    if (this.Online) {
      if (this.data.lat != 0 && this.data.lng != 0)
        pos = map([this.data.lng, this.data.lat]);
      else {
        pos = map([10.75, 34.75])
        this.data.lat = pos[0];
        this.data.lng = pos[1];
        this.data.city = 'Sfax'
        this.cities.forEach(element => {
          if (element.c.toString().trim() == this.data.city)
            this.muni = element.m;

        });
      }

    } else {
      this.presentPopover(null, {
        content: "You are in Offline Mode Map Location is not available would you Like to Continue ?",
        bigImage: 'assets/images/spam.png',
        button: 'Yes'
      })
    }

    const ionSelects = document.querySelectorAll('ion-select');
    ionSelects.forEach((sel) => {
      sel.shadowRoot.querySelectorAll('.select-icon-inner')
        .forEach((elem) => {
          elem.setAttribute('style', 'display: none;');
        });
    });
    this.splash = false;
  }


  GetLatLng() { // when selecting a location on map 
    if (!this.Online)
      return
    this.clickByMouse = true;
    let pos = getLatLng();
    this.data.lat = pos.lat;
    this.data.lng = pos.lng;
    this.splash = true;
    this.http.getCityFromApi(pos.lat, pos.lng).subscribe(res => {
      let region: any = res;
      let v = region.results[0].components;
      if (v.state || v.region) {
        let city = v.state || v.region
        let exist = false
        this.cities.forEach(element => {
          if (element.c == city) {
            exist = true
            return
          }
        });
        if (!exist) {
          this.presentPopover(null, {
            bigImage: "assets/images/geoLocation.png",
            content: "Sorry! your selection is in " + v.country + ", i'm afraid we cant help you,  please select a location in tunisia boundaries"
          })
          this.splash = false
          return
        }
        if (city.toString().trim() != this.data.city.toString().trim() && city != 'init') {
          if (this.data.city != '')
            this.presentPopover(null, {
              bigImage: "assets/images/geoLocation.png",
              content: "Your Selected City " + this.data.city + "  is Not in this area you maybe mean you live in " + city + " So We fix it for you "
            })
          this.data.municipalite = '';
          this.splash = false;
          this.cityBeforeChanged = city;
          this.data.city = city;
          this.cities.forEach(element => {
            if (element.c.toString().trim() == this.data.city)
              this.muni = element.m;
          });
        }
      } else {
        this.presentPopover(null, {
          bigImage: "assets/images/geoLocation.png",
          content: "Sorry! you selected a sea , please make sure that your marker is on the land "
        })
        this.splash = false;
      }



    }, err => {
      this.splash = false;
      this.presentPopover(null, {
        bigImage: "assets/images/geoLocation.png",
        content: "something went wrong please try again"
      })
    })
    /*
      OLD METHOD USING CUSTOM MODEL 
        collectData(pos.lat, pos.lng).then(v => {
          v = v[0].label
          this.splash = false;
    
    
          if (v.toString().trim() != this.data.city.toString().trim() && v != 'init') {
            if (this.data.city != '')
              this.presentPopover(null, {
                bigImage: "assets/images/geoLocation.png",
                content: "Your Selected City " + this.data.city + "  is Not in this area you maybe mean you live in " + v + " So We fix it for you "
              })
            this.data.city = v;
            this.cityBeforeChanged = v;
            this.cities.forEach(element => {
              if (element.c.toString().trim() == this.data.city)
                this.muni = element.m;
    
            });
          }
    
          this.data.municipalite = '';
    
        }).catch(err => this.data.city = err)*/
  }
  touchstart() {
    this.isTouched = true;
  }
  touchend() {
    this.isTouched = false;
    if (!this.scrolling) {
      this.handledInTouchEnd = true;
      if (this.ScrollY > 60)
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
      if (this.ScrollY > 60)
        this.IonContent.scrollToPoint(0, 150, 400);
      else if (this.ScrollY < 60)
        this.IonContent.scrollToTop(200)
    }
  }
  startScroll() {
    if (this.isTouched)
      this.scrolling = true
  }

  trainModule() {
    fetch("../../assets/module/dataT.json").then(res => res.json()).then(json => {
      train(json.t);// look up for more informations
      //deactivating the loading screen after loading the heavey data 
    });

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

  autoLocate() {
    this.splash = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      let lat = resp.coords.latitude
      let lng = resp.coords.longitude

      map([lng, lat])
      this.data.lng = lng
      this.data.lat = lat
      this.splash = false;

      this.http.getCityFromApi(lat, lng).subscribe(res => {
        let region: any = res;
        let v = region.results[0].components.state || region.results[0].components.region;
        if (v.toString().trim() != this.data.city.toString().trim() && v != 'init') {
          if (this.data.city != '')
            this.presentPopover(null, {
              bigImage: "assets/images/geoLocation.png",
              content: "Your Selected City " + this.data.city + "  is Not in this area you maybe mean you live in " + v + " So We fix it for you "
            })
        }
        this.splash = false;
        this.cityBeforeChanged = v;
        this.data.city = v;
        this.cities.forEach(element => {
          if (element.c.toString().trim() == this.data.city)
            this.muni = element.m;
        });

        this.data.municipalite = '';
      }, err => {
        this.splash = false;
        this.presentPopover(null, {
          bigImage: "assets/images/geoLocation.png",
          content: "something went wrong please try again"
        })
      })
      /*
      OLD METHOD USING THE CUSTUM AI MODULE
      collectData(lat, lng).then(v => {
        v = v[0].label
        this.splash = false;


        if (v.toString().trim() != this.data.city.toString().trim() && this.data.city != '' && v != 'init') {
          this.presentPopover(null, {
            bigImage: "assets/images/geoLocation.png",
            content: "Your Selected City " + this.data.city + "  is Not in this area you maybe mean you live in " + v + " So We fix it for you "
          })
          this.data.city = v;
          this.cityBeforeChanged = v
          this.cities.forEach(element => {
            if (element.c.toString().trim() == this.data.city)
              this.muni = element.m;
          });
        }


        this.data.municipalite = '';

      }).catch(err => this.data.city = err)
    }).catch(err => {
      this.splash = false;
      this.presentPopover(null, {
        bigImage: "assets/images/spam.png",
        content: "your device is not compatible with this feature"
      })
      */
    })
  }
  logScrollStart(ev) { // animations
    this.ScrollY = ev.detail.scrollTop;
    this.cssProp.backGroundTop = this.map(this.ScrollY, 0, 150, 0, 20)
    this.cssProp.backGroundTop = 30 - Number(this.cssProp.backGroundTop) + "%"
    this.cssProp.textOpacity = this.map(this.ScrollY, 0, 110, 0, 1);
    this.cssProp.textOpacity = 1 - this.cssProp.textOpacity;
    this.cssProp.titleSize = this.map(this.ScrollY, 0, 150, 30, 25) + "px";
    this.cssProp.titleTop = this.map(this.ScrollY, 0, 150, 90, 25) + "%";
    this.cssProp.titleLeft = this.map(this.ScrollY, 0, 150, 10, 17) + "% ";
    this.cssProp.textTop = this.map(this.ScrollY, 0, 150, 16, 12) + "%";
  }
  map(x, in_min, in_max, out_min, out_max) {
    if (x < in_min)
      x = in_min
    else if (x > in_max)
      x = in_max
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  ngOnInit() {

  }

}
