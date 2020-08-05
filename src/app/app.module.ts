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
import { HttpClientModule } from '@angular/common/http';
import { HttpClaimService } from 'src/app/services/http/http-claim.service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { PopoverComponentComponent } from './components/popover-component/popover-component.component';
import { Network } from '@ionic-native/network/ngx';


// import { Geolocation } from '@ionic-enterprise/geolocation/ngx'; 
@NgModule({
  declarations: [AppComponent, PopoverComponentComponent],
  entryComponents: [PopoverComponentComponent],
  imports: [BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    IonicStorageModule.forRoot()],
  providers: [
    Network,
    UniqueDeviceID,
    HttpClaimService,
    Camera,
    FileChooser,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
