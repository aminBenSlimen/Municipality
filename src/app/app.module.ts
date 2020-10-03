import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, PopoverController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { PopoverComponentComponent } from './components/popover-component/popover-component.component';
import { Network } from '@ionic-native/network/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { File } from '@ionic-native/file/ngx';
import { SocialSharing } from "@ionic-native/social-sharing/ngx";
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { Geolocation } from '@ionic-enterprise/geolocation/ngx'; 

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assest/i18n/', '.json')
}
@NgModule({
  declarations: [AppComponent, PopoverComponentComponent],
  entryComponents: [PopoverComponentComponent],
  imports: [BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })],

  providers: [
    Network,
    UniqueDeviceID,
    HttpClaimService,
    Camera,
    FileChooser,
    StatusBar,
    SplashScreen,
    Keyboard,
    File,
    SocialSharing,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
