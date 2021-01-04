import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { ComponentsModule } from '../../components/components.module';
import { TabPageRoutingModule } from '../../components/tab/tab-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    // TabPageRoutingModule,
    ComponentsModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
