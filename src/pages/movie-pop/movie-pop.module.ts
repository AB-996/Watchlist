import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoviePopPage } from './movie-pop';

@NgModule({
  declarations: [
    MoviePopPage,
  ],
  imports: [
    IonicPageModule.forChild(MoviePopPage),
  ],
})
export class MoviePopPageModule {}
