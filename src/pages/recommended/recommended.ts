import {
  Component,
  OnDestroy
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
import {
  Storage
} from '@ionic/storage';
import {
  Subscription
} from 'rxjs/Subscription';
import * as similarity from "compute-cosine-similarity";



@IonicPage()
@Component({
  selector: 'page-recommended',
  templateUrl: 'recommended.html',
})
export class RecommendedPage implements OnDestroy {

  ratingsData = [];
  ratings = [];
  k = 3;
  getRatings: Subscription;
  fakeMatrixContent = [];
  neighbourhood = [];
  recommended = [];

  constructor(private movieService: MovieService, private authService: AuthService,
    private storage: Storage) {}

  ionViewDidLoad() {
    this.storage.keys().then(
      response => {
        if (response.indexOf("dataRatings") == -1) {
          var t1 = performance.now();
          this.authService.getActiveUser().getToken()
            .then(
              token => {
                this.movieService.getRatingsData(token)
                  .subscribe(
                    (response) => {
                      console.log(response);
                      this.storage.set("dataRatings", response["-L5E0as5EX_99dNGhGG9"]).then(
                        responseStorage => {
                          var t2 = performance.now();
                          console.log("Sad se spremaju ratingsi");
                          this.ratingsData = responseStorage;
                          console.log("Ušlo Set");
                          console.log(t2 - t1);
                          this.getRatings = this.movieService.getRatings().subscribe(
                            response => {
                              this.ratings = response
                              this.getRecommended();
                            }
                          )
                        }
                      );
                    })
              }
            )
        } else {
          console.log("postoji");
          var t1 = performance.now();
          this.storage.get("dataRatings").then(
            responseStorage => {
              this.ratingsData = responseStorage;
              var t2 = performance.now();
              console.log(t2 - t1);
              this.getRatings = this.movieService.getRatings().subscribe(
                response => {
                  this.ratings = response;
                  this.getRecommended();
                }
              )
            }
          );
        }
      }
    )
  }

  getRecommended() {
    console.log("Ratovie");
    console.log(this.ratingsData);
    for (var i = 0; i < this.ratings.length; i++) {
      this.usersRated(this.ratings[i].name);
    }
    this.addUnrated();
    console.log("Matrix");
    console.log(this.fakeMatrixContent);
    this.neighbourhood = this.calculateSimilarity();
    console.log(this.neighbourhood);
    this.recommended = this.getMoviesFromNeighbours();
  }


  usersRated(item) {
    for (var i = 0; i < this.ratingsData.length; i++) {
      let indexMovie = this.ratingsData[i].ratings.map((item) => {return item.movie_id}).indexOf(item);
      if (indexMovie != -1) {
        let indexUser = this.fakeMatrixContent.map((item) => {return item.id}).indexOf(this.ratingsData[i].id);
        if (indexUser != -1) {
          this.fakeMatrixContent[indexUser].ratings.push({
            name: this.ratingsData[i].ratings[indexMovie].movie_id,
            rating: +this.ratingsData[i].ratings[indexMovie].rating,
            genres: this.ratingsData[i].ratings[indexMovie].genres
          });
        } else {
          this.fakeMatrixContent.push({
            id: this.ratingsData[i].id,
            ratings: [{
              name: this.ratingsData[i].ratings[indexMovie].movie_id,
              rating: +this.ratingsData[i].ratings[indexMovie].rating,
              genres: this.ratingsData[i].ratings[indexMovie].genres
            }]
          });
        }
      }
    }
    console.log(this.fakeMatrixContent);
  }

  addUnrated() {
    for (var i = 0; i < this.ratings.length; i++) {
      for (var j = 0; j < this.fakeMatrixContent.length; j++) {
        if (this.fakeMatrixContent[j].ratings.map((item) => {return item.name}).indexOf(this.ratings[i].name) == -1) {
          this.fakeMatrixContent[j].ratings.push({
            name: this.ratings[i].name,
            rating: 0.1,
            genres: this.ratings[i].genres.toString()
          });
        }
      }
    }
    this.sortRows();
  }

  sortRows() {
    this.ratings.sort((a, b) => {
      return (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0
    });
    for (let i = 0; i < this.fakeMatrixContent.length; i++) {
      this.fakeMatrixContent[i].ratings.sort((a, b) => {
        return (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0
      });
    }
    console.log(this.fakeMatrixContent);
    console.log("Ratings od usera")
    console.log(this.ratings);
  }

  calculateSimilarity() {
    var userRatings = [];
    for (let i = 0; i < this.ratings.length; i++) {
      userRatings.push(this.ratings[i].rating);
    }
    var ratingsToCompare = [];
    for (let i = 0; i < this.fakeMatrixContent.length; i++) {
      let ratedMovies = [];
      for (let j = 0; j < this.fakeMatrixContent[i].ratings.length; j++) {
        ratedMovies.push(this.fakeMatrixContent[i].ratings[j].rating);
      }
      ratingsToCompare.push({
        id: this.fakeMatrixContent[i].id,
        ratings: ratedMovies
      });
    }
    console.log(userRatings);
    console.log(ratingsToCompare);
    var userSimilarity = [];
    for (var i = 0; i < ratingsToCompare.length; i++) {
      userSimilarity.push({
        id: ratingsToCompare[i].id,
        similarity: similarity(userRatings, ratingsToCompare[i].ratings)
      });
    }
    console.log("Filtered");
    userSimilarity = userSimilarity.filter((item) => {
      return !isNaN(item.similarity)
    });
    console.log(userSimilarity);

    return userSimilarity.sort((a, b) => {
      return (a.similarity > b.similarity) ? -1 : (a.similarity < b.similarity) ? 1 : 0
    }).slice(0, this.k);
  }

  getMoviesFromNeighbours() {
    var genres = [];
    for(var i = 0; i < this.ratings.length; i++){
      for(var j = 0; j < this.ratings[i].genres.length; j++){
        console.log("Genres ušlo");
        let indexG = genres.map((item)=> {return item.name}).indexOf(this.ratings[i].genres[j]);
        if(indexG == -1){
          genres.push({name : this.ratings[i].genres[j], count : 1});
        }else{
          genres[indexG].count += 1;
        }
      }
    }
    genres.sort((a, b) => {return (a.count > b.count) ? -1 : (a.count < b.count) ? 1 : 0});
    console.log("genres");
    console.log(genres);
    var movies = [];
    var userMovies = [];
    console.log("Susjedstvo");
    console.log(this.neighbourhood);
    console.log(this.ratings);
    for (var i = 0; i < this.neighbourhood.length; i++) {
      console.log("susjed");
      let movieData = this.ratingsData.filter(item => {
        return item.id === this.neighbourhood[i].id
      });
      console.log(movieData);
      for (let i = 0; i < this.ratings.length; i++) {
        for (let j = 0; j < this.ratings[i].genres.length; j++) {
          for (let k = 0; k < movieData[0].ratings.length; k++) {
            if (movieData[0].ratings[k].genres.split(",").indexOf(this.ratings[i].genres[j]) != -1) {
              let movieExists = movies.map((item) => {return item.movie_id}).indexOf(movieData[0].ratings[k].movie_id);
              if (movieExists != -1) {
                let repeat;
                if(this.ratings[i].genres[j] == genres[0].name){
                  repeat = 3;
                }else if(this.ratings[i].genres[j] == genres[1].name){
                  repeat = 2;
                }else{
                  repeat = 1;
                }
                movies[movieExists].repeat += repeat;
              } else {
                let item = movieData[0].ratings[k];
                item.repeat = 1;
                movies.push(item);
              }
            }
          }
        }
      }
    }
    movies.sort((a, b) => {
      return (a.repeat > b.repeat) ? -1 : (a.repeat < b.repeat) ? 1 : 0
    });
    var recommended = [];
    for (var i = 0; i < movies.length; i++) {
      if (this.ratings.map((item) => {return item.name}).indexOf(movies[i].movie_id) == -1) {
        if (movies[i].rating >= 4) {
          recommended.push(movies[i]);
          if (recommended.length == 12) {
            break;
          }
        }
      }
    }
    console.log(recommended);
    return recommended;
  }

  ngOnDestroy() {
    this.getRatings.unsubscribe();
  }
}
