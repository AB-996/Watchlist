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
import * as firebase from "firebase";
import { } from "angularfire2";

/**
 * Generated class for the WatchlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-watchlist',
  templateUrl: 'watchlist.html',
})
export class WatchlistPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private movieService: MovieService, private authService: AuthService) {}

  watchlist;

  ionViewWillEnter() {
    console.log("Ušlo");
    this.authService.getActiveUser().getIdToken()
      .then(token => {
        this.movieService.getWatchlist(token).subscribe(
          data => {this.watchlist = data;
          console.log(this.watchlist);
          },
          error => {console.log("error")}
        )
        console.log(this.watchlist);
        
          // .subscribe(
          //   data => {this.watchlist = data
          // console.log(this.watchlist)})
      });
  }


  onDelete(index: number) {
    this.authService.getActiveUser().getIdToken()
      .then(
        token => {
          this.movieService.removeFrom("watchlist", index, token)
            .subscribe(data => this.watchlist = data)})
  }

  onView(dataOfMedia : any){
    this.navCtrl.push(MoviePage, {id : dataOfMedia.id,  type : dataOfMedia.media_type});
  }

}
