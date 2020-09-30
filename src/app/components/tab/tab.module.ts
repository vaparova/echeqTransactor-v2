import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


import { TabPageRoutingModule } from './tab-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabPageRoutingModule
  ],
  // exports: [TabPage],
  // declarations: [TabPage]
})
export class TabPageModule {}
