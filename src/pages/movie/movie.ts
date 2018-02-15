import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavParams,
  PopoverController,
  AlertController,
  ToastController
} from 'ionic-angular';
import {
  InAppBrowser,
  InAppBrowserOptions
} from '@ionic-native/in-app-browser';
import {
  MoviePopPage
} from '../movie-pop/movie-pop';
import {
  MovieService
} from '../../app/services/movies';
import {
  AuthService
} from '../../app/services/auth';

@IonicPage()
@Component({
  selector: 'page-movie',
  templateUrl: 'movie.html',
})
export class MoviePage {

  constructor(private navParams: NavParams, private iab: InAppBrowser,
    private popCtrl: PopoverController, private movieService: MovieService,
    private alertCtrl: AlertController, private toastCtrl: ToastController,
    private authService: AuthService) {
    this.id = this.navParams.get("id");
    this.mediaType = this.navParams.get("type");
    console.log(this.mediaType);
  }

  id: any;
  mediaType: string;
  data: any;
  rating: any;
  ratings = [];
  rate;

  ionViewWillEnter() {
    if (this.mediaType == "movie") {
      this.movieService.getDetailsMovie(this.id)
        .subscribe(
          response => {
            alert("Ušloo");
            this.data = response;
            this.getRatings();
          }
        )
    } else if (this.mediaType == "tv") {
      this.movieService.getDetailsTv(this.id)
        .subscribe(response => {
          this.data = response;
          this.getRatings();
        })
    }
  }

  visitWebsite(url: string) {
    const options: InAppBrowserOptions = {
      zoom: "no",
      location: "no"
    }
    let browser = this.iab.create(url, "_self", options);
  }

  getRatings(){
    this.movieService.getRatings().subscribe(
      data => {
        this.ratings = data;
        for(var i = 0; i < this.ratings.length; i++){
          alert(this.ratings[i].name);
        }
        let rated = this.checkIfInRatings(-1);
        console.log(rated);
        if (rated) {
          this.rate = rated;
        }
      },
      error => {console.log("error")}
    )
  }

  checkIfInRatings(event) {
    if (this.mediaType == "movie") {
      for (let i = 0; i < this.ratings.length; i++) {
        if (this.ratings[i].name == this.data.title) {
          console.log(this.ratings[i].name);
          console.log(this.data.title);
          if (event != -1) {
            this.ratings[i].rating = event;
            return true;
          } else {
            return this.ratings[i].rating;
          }
        }
      }
    } else if (this.mediaType == "tv") {
      for (let i = 0; i < this.ratings.length; i++) {
        if (this.ratings[i].name == this.data.name) {
          if (event != -1) {
            this.ratings[i].rating = event;
            return true;
          } else {
            return this.ratings[i].rating
          }
        }
      }
    }
    console.log("Prošlo");
    return false;
  }

  onModelChange(event: any) {
    console.log(event);
    if (this.checkIfInRatings(event)) {
      this.movieService.addRating(this.ratings);
    } else {
      var movieData = {
        name: this.data.title,
        rating: event,
        genres: []
      };
      console.log(this.data.genres);
      for(let i = 0; i < this.data.genres.length; i++){
        console.log("Ušlo");
        movieData.genres.push(this.data.genres[i].name);
      }
      if (this.mediaType == "movie") {
        this.ratings.push(movieData);
        this.movieService.addRating(this.ratings);
      } else if (this.mediaType == "tv") {
        let tvData = {
          name: this.data.name,
          rating: event,
          genres: []
        };
        for(let i = 0; i < this.data.genres.length; i++){
          console.log(this.data);
          tvData.genres.push(this.data.genres[i].name);
        }
        console.log(tvData);
        this.ratings.push(tvData);
        this.movieService.addRating(this.ratings);
      }
    }
  }

  onOptions(event: MouseEvent) {
    const popover = this.popCtrl.create(MoviePopPage);
    popover.present({
      ev: event
    });
    popover.onDidDismiss(
      data => {
        if (!data) {
          return;
        } else if (data.action === "fav") {
          if (this.movieService.isMovieFavorite(this.data)) {
            const toast = this.toastCtrl.create({
              position: "bottom",
              message: "This movie is already added to your favorites!",
              duration: 2000,
            });
            toast.present();
            return;
          }
          const alert = this.alertCtrl.create({
            title: "Add to favorites",
            message: "Do you really want to add this item to favorites?",
            buttons: [{
                text: "Yes",
                handler: () => {
                  this.authService.getActiveUser().getToken()
                    .then(
                      token => {
                        console.log(this.data);
                        this.data.media_type = this.mediaType;
                        console.log(this.data);
                        this.movieService.addToFavorites(this.data, token)
                          .subscribe(
                            () => {
                              const toast = this.toastCtrl.create({
                                position: "bottom",
                                message: "Item added to favorites!",
                                duration: 2000,
                              });
                              toast.present();
                            });
                      });
                }
              },
              {
                text: "No",
                role: "cancel"
              }
            ]
          });
          alert.present();
        } else if (data.action === "watch") {
          if (this.movieService.isMovieInWatchlist(this.data)) {
            const toast = this.toastCtrl.create({
              position: "bottom",
              message: "This item is already added to your Watchlist!",
              duration: 2000,
            });
            toast.present();
            return;
          }
          const alert = this.alertCtrl.create({
            title: "Add to watchlist",
            message: "Do you really want to add this item to watchlist?",
            buttons: [{
                text: "Yes",
                handler: () => {
                  this.authService.getActiveUser().getToken()
                    .then(
                      token => {
                        this.data.media_type = this.mediaType;
                        this.movieService.addToWatchlist(this.data, token);

                        // .subscribe(
                        //   ()=> {
                        //     const toast = this.toastCtrl.create({
                        //       position: "bottom",
                        //       message: "Item added to your Watchlist!",
                        //       duration: 2000,
                        //     });
                        //     toast.present();
                        //   });
                      });
                }
              },
              {
                text: "No",
                role: "cancel"
              }
            ]
          });
          alert.present();
        }
      }
    )
  }

}
