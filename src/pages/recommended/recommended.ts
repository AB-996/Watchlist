import {
  Component, OnDestroy
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
import { Subscription } from 'rxjs/Subscription';
import * as similarity from "compute-cosine-similarity";



@IonicPage()
@Component({
  selector: 'page-recommended',
  templateUrl: 'recommended.html',
})
export class RecommendedPage implements OnDestroy{

  ratingsData = [];
  ratings = [];
  k = 3;
  getRatings : Subscription;
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
                      this.storage.set("dataRatings", response["-L54qMgR4MT7kCd_R2gZ"]).then(
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
                              console.log("Izašlo");
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

  getRecommended(){
    var x = [ 5, 23, 2, 5, 9 ],
    y = [ 3, 21, 2, 5, 14 ];
    console.log("Similarity: " + similarity(x, y));
    for(var i = 0; i < this.ratings.length; i++){
      this.usersRated(this.ratings[i].name);
    }
    this.fakeMatrixContent = this.fakeMatrixContent.filter((item) => {if(item.ratings.length >= 3){return item}});
    this.addUnrated();
    this.neighbourhood = this.calculateSimilarity();
    console.log(this.neighbourhood);
    this.recommended = this.getMoviesFromNeighbours();
  }


  usersRated(item){
    for(var i = 0; i < this.ratingsData.length; i++){
      let indexMovie = this.ratingsData[i].ratings.map((item)=> {return item.movie_id}).indexOf(item);
      if(indexMovie != -1 ){
        let indexUser = this.fakeMatrixContent.map((item) => {return item.id}).indexOf(this.ratingsData[i].id);
        if(indexUser != -1){
          this.fakeMatrixContent[indexUser].ratings.push({name : this.ratingsData[i].ratings[indexMovie].movie_id, rating : +this.ratingsData[i].ratings[indexMovie].rating});
        }else{
          this.fakeMatrixContent.push({id : this.ratingsData[i].id, ratings : [{name : this.ratingsData[i].ratings[indexMovie].movie_id, rating : +this.ratingsData[i].ratings[indexMovie].rating}]});
        }
      }
    }
  }

  addUnrated(){
    for(var i = 0; i < this.ratings.length; i++){
      for(var j = 0; j < this.fakeMatrixContent.length; j++){
        if(this.fakeMatrixContent[j].ratings.map((item)=> {return item.name}).indexOf(this.ratings[i].name) == -1){
          this.fakeMatrixContent[j].ratings.push({name: this.ratings[i].name, rating : 0});
        }
      }
    }
    this.normalize()
  }

  normalize(){
    for(let i = 0; i< this.fakeMatrixContent.length; i++){
      let count = 0;
      let sum = 0;
      for(let j = 0; j < this.fakeMatrixContent[i].ratings.length; j++){
        let item = this.fakeMatrixContent[i].ratings[j].rating;
        if(item != 0){
          sum += item;
          count += 1;
        }
      }
      let divider = sum / count;
      for(let j = 0; j < this.fakeMatrixContent[i].ratings.length; j++){
        if(this.fakeMatrixContent[i].ratings[j].rating != 0){
          this.fakeMatrixContent[i].ratings[j].rating =  +(this.fakeMatrixContent[i].ratings[j].rating - divider);
        }
      }
    }
    let sumUser = 0;

    for(let i = 0; i < this.ratings.length; i++){
      sumUser += this.ratings[i].rating;
    }
    let dividerUser = sumUser / this.ratings.length;
    for(let i = 0; i < this.ratings.length; i++){
      this.ratings[i].rating = +( this.ratings[i].rating - dividerUser);
    }

    this.ratings.sort((a,b) => { return (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0 } );
    for(let i = 0; i < this.fakeMatrixContent.length; i++){
      this.fakeMatrixContent[i].ratings.sort((a,b) => { return (a.name > b.name) ? 1 : (a.name < b.name) ? -1 : 0 });
    }
    console.log(this.fakeMatrixContent);
    console.log(this.ratings);
  }

  calculateSimilarity(){
    var userRatings = [];
    for(let i = 0; i < this.ratings.length; i++){
      userRatings.push(this.ratings[i].rating);
    }
    var ratingsToCompare = [];
    for(let i = 0; i < this.fakeMatrixContent.length; i++){
      let ratedMovies = [];
      for(let j = 0; j < this.fakeMatrixContent[i].ratings.length; j++){
        ratedMovies.push(this.fakeMatrixContent[i].ratings[j].rating);
      }
      ratingsToCompare.push({id : this.fakeMatrixContent[i].id, ratings : ratedMovies});
    }
    console.log(userRatings);
    console.log(ratingsToCompare);
    var userSimilarity = [];
    for(var i = 0; i < ratingsToCompare.length; i++){
      userSimilarity.push({id : ratingsToCompare[i].id, similarity : similarity(userRatings, ratingsToCompare[i].ratings)});
    }
    console.log("Filtered");
    userSimilarity =  userSimilarity.filter((item) => {return !isNaN(item.similarity)});
    console.log(userSimilarity);

    return userSimilarity.sort((a,b) => {return (a.similarity > b.similarity) ? -1 : (a.similarity < b.similarity) ? 1 : 0}).slice(0,this.k);
  }

  getMoviesFromNeighbours(){
    var movies = [];
    var userMovies = [];
    for(var i = 0; i < this.neighbourhood.length; i++){
    let num = 0;
     let movieData = this.ratingsData.filter(item => {return item.id === this.neighbourhood[i].id});
     movieData[0].ratings.sort((a,b) => {return (+a.rating > b.rating) ? -1 : (+a.rating < b.rating) ? 1 : 0});
     console.log(movieData);
     for(var j = 0; j < movieData[0].ratings.length; j++){
       if(this.ratings.map((item) => {return item.name}).indexOf( movieData[0].ratings[j].movie_id) == -1 &&
       movies.map((item) => {return item.movie_id}).indexOf( movieData[0].ratings[j].movie_id) == -1){
         movies.push(movieData[0].ratings[j]);
         num += 1;
       }
       if(num == 4){break;}
     }
    }
    return movies;
  }

  ngOnDestroy(){
    this.getRatings.unsubscribe();
  }
}
