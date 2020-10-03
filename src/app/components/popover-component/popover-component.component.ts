import { Component, OnInit, Input } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-popover-component',
  templateUrl: './popover-component.component.html',
  styleUrls: ['./popover-component.component.scss'],
})
export class PopoverComponentComponent implements OnInit {
  type: any = {};
  popover: any = this;
  constructor(public navParams: NavParams,
    private router: Router) {

    this.type = JSON.parse(JSON.stringify(this.navParams.data));
    this.type.button = this.type.button || "Got It"
  }
  ngOnInit() { }
  dismissPopover() {
    if (this.type.role == 'GoToWelcomePage') {
      this.popover.dismiss().then(() => { this.popover = null; });
      this.router.navigate([""])
    } else if (this.popover) {
      this.popover.dismiss().then(() => { this.popover = null; });
    }
  }
}
