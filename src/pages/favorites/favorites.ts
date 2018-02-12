import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  MovieService
} from '../../app/services/movies';
import {
  AuthService
} from '../../app/services/auth';
import { MoviePage } from '../movie/movie';

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private movieService: MovieService, private authService: AuthService) {}

  favorites: any[];

  ionViewWillEnter() {
    this.authService.getActiveUser().getIdToken()
      .then(token => this.movieService.getFavorites(token)
        .subscribe(
          response => {
            this.favorites = response;
          }));
  }


  onDelete(index: number) {
    this.authService.getActiveUser().getIdToken()
      .then(token => {
        this.movieService.removeFrom("favorites", index, token)
          .subscribe(data => this.favorites)});
  }

  onView(dataOfMedia : any){
    console.log(dataOfMedia.id);
    console.log(dataOfMedia.media_type);
    this.navCtrl.push(MoviePage, {id : dataOfMedia.id,  type : dataOfMedia.media_type})
  }

}
