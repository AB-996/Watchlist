import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MovieTvPage } from './movie-tv';

@NgModule({
  declarations: [
    MovieTvPage,
  ],
  imports: [
    IonicPageModule.forChild(MovieTvPage),
  ],
})
export class MovieTvPageModule {}
