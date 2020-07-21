import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animated-like',
  templateUrl: './animated-like.component.html',
  styleUrls: ['./animated-like.component.scss'],
})
export class AnimatedLikeComponent implements OnInit {

  public likeState: string = 'unliked';
  public iconName: string = 'heart-empty';

  constructor() { }

  ngOnInit() {

  }

  toggleLikeState() {

    if (this.iconName == 'heart-empty') {
      this.likeState = 'liked';
      this.iconName = 'heart';
    } else {
      this.likeState = 'unliked';
      this.iconName = 'heart-empty';
    }

  }

}