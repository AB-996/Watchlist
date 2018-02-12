import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TvDetailPage } from './tv-detail';

@NgModule({
  declarations: [
    TvDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TvDetailPage),
  ],
})
export class TvDetailPageModule {}
