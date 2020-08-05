import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';
import { AnimationController } from '@ionic/angular';
import { Howl } from 'howler';
@Component({
  selector: 'app-animated-like',
  templateUrl: './animated-like.component.html',
  styleUrls: ['./animated-like.component.scss'],
})
export class AnimatedLikeComponent implements OnInit {

  @Input() state: string;

  public likeState: string = this.state;
  public iconName: string = (this.state == 'liked') ? 'heart' : 'heart-outline';
  public fontS: string = '30px';
  public fontSN: number = 30;
  player: Howl;
  @ViewChild('heart', { read: ElementRef, static: true }) heart: ElementRef;
  constructor(
    private animCtr: AnimationController
  ) { }

  ngOnInit() {
  }

  toggleLikeState() {
    if (this.iconName == 'heart-outline') {
      this.likeState = 'liked';
      this.iconName = 'heart';
      this.animationUP();
    } else {
      this.likeState = 'unliked';
      this.iconName = 'heart-outline';
      this.animationDown();
    }

  }
  animationUP() {
    const animaion = this.animCtr
      .create()
      .addElement(this.heart.nativeElement)
      .duration(100)
      .fromTo('transform', 'scale3d(1,1,1)', 'scale3d(2,2,2)')
      .delay(60)
      .fromTo('transform', 'scale3d(2,2,2)', 'scale3d(1,1,1)')
    this.player = new Howl({
      src: 'assets/mp3/like.mp3'
    })
    this.player.play();
    animaion.play();
  }
  animationDown() {
    const animaion = this.animCtr
      .create()
      .addElement(this.heart.nativeElement)
      .duration(100)
      .fromTo('transform', 'scale3d(1,1,1)', 'scale3d(.5,.5,.5)')
      .delay(60)
      .fromTo('transform', 'scale3d(.5,.5,.5)', 'scale3d(1,1,1)')
    this.player = new Howl({
      src: 'assets/mp3/dislike.mp3'
    })
    this.player.play();
    animaion.play();
    animaion.play();
  }
}