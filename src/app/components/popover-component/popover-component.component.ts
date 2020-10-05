import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-popover-component',
  templateUrl: './popover-component.component.html',
  styleUrls: ['./popover-component.component.scss'],
})
export class PopoverComponentComponent implements OnInit {
  type: any = {};
  popover: any = this;
  constructor(public navParams: NavParams,
    private router: Router, private translate: TranslateService) {

    this.type = JSON.parse(JSON.stringify(this.navParams.data));
    this.type.button = this.type.button || "Got It"
  }
  ngOnInit() { }
  dismissPopover() {
    if (this.type.role == this.translate.instant("INFREC.ALERTS.buttons.route")) {
      this.popover.dismiss().then(() => { this.popover = null; });
      this.router.navigate([""])
    } else if (this.popover) {
      this.popover.dismiss().then(() => { this.popover = null; });
    }
  }
}
