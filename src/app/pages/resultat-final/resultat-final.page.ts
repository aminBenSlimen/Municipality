import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-resultat-final',
  templateUrl: './resultat-final.page.html',
  styleUrls: ['./resultat-final.page.scss'],
})
export class ResultatFinalPage implements OnInit {
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
  constructor(public router: Router,
    private route: ActivatedRoute,
    private http: HttpClaimService,
    private platform: Platform) {
    this.route.queryParams.subscribe((res) => {
      this.data = JSON.parse(res.p);
      if (this.data.image == '')
        this.data.image = "./assets/images/NoImage.jpeg"
    });

    this.platform.backButton.subscribe(() => {
      this.backward();
    });
  }
  backward() {
    this.router.navigate(["/information-de-reclamation"], {
      queryParams: { p: JSON.stringify(this.data) },
    })
  }

  submit() {
    this.http.postData(this.data);
  }
  ngOnInit() {
  }
  onsubmit(uuid, data) {
    let syscreated_at = new Date();
    let userClaims = [];
    let d1 = syscreated_at.getFullYear() * 1000000 + (syscreated_at.getMonth() + 1) * 10000 +
      syscreated_at.getDate() * 100 + syscreated_at.getHours();

    //collect all user's claims
    for (var i = 0; i < data.length; i++) {
      if (data[i].id == uuid) {
        userClaims.push(data[i]);
      }
    }

    let top5 = [];
    var cond = (userClaims.length <= 5) ? userClaims.length : 5;


    // Select the 5 recent Claims and Push them to the Top5 Array
    for (var i = 0; i < cond; i++) {
      let min = 0;
      userClaims.forEach(elm => {
        const hours = Number(elm.created_at.substring(11, 13));
        const day = Number(elm.created_at.substring(8, 11));
        const year = Number(elm.created_at.substring(0, 4));
        const month = Number(elm.created_at.substring(5, 7));

        let elmDate = year * 1000000 + month * 10000 + day * 100 + hours;
        if (elmDate > min && !this.containsObject(elmDate, top5)) {
          min = elmDate;
        }
      })
      top5.push(min);
    }

    // the 5th Claim and the first Claim must be offceted by at least 24 Hours
    if ((top5.length < 5) || (Math.abs(top5[0] - top5[top5.length - 1]) > 24))
      console.log("let him");
    else if (Math.abs(d1 - top5[0]) < 24)
      console.log("not let him" + Math.abs(d1 - top5[0]));
    else
      console.log("let him from the other cond");
  }


  containsObject(obj, list) {
    for (var i = 0; i < list.length; i++)
      if (list[i] === obj)
        return true;

    return false;
  }

}
