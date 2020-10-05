import { Component } from '@angular/core';

import { Platform, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NetworkService, ConnectionStatus } from './services/network/network.service';
import { OfflineManagerService } from './services/offlineManager/offline-manager.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { PopoverComponentComponent } from './components/popover-component/popover-component.component';
import { LanguageServiceService } from './services/languageService/language-service.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private networkService: NetworkService,
    private platform: Platform,
    private popOver: PopoverController,
    private offlineManager: OfflineManagerService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private uid: UniqueDeviceID,
    private languageService: LanguageServiceService
  ) {
    this.initializeApp();
  }

  componentDidLoad() {
    this.splashScreen.hide();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      //this.statusBar.styleDefault();
      this.statusBar.hide();
      this.splashScreen.hide();
      this.languageService.initLang()
    });

    this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
      if (status == ConnectionStatus.Online) {
        this.offlineManager.checkForEvents().subscribe();
      }
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
}
