import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionStatus, NetworkService } from 'src/app/services/network/network.service';
declare var animate: Function;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  Online;
  constructor(private router: Router, private networkService: NetworkService) {
    this.Online = this.networkService.getCurrentNetworkStatus() == ConnectionStatus.Online ? true : false;
    if (this.Online)
      animate()
  }

  ngOnInit() {

  }
  forward() {
    this.router.navigate([""]);
  }
}
