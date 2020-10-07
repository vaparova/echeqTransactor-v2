import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { TabPageRoutingModule } from './components/tab/tab-routing.module';
import { AlertasService } from './providers/alertas.service';
import { EventosService } from './providers/eventos.service';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    FormsModule,
    MbscModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule, ComponentsModule, TabPageRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    AlertasService,
    EventosService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
