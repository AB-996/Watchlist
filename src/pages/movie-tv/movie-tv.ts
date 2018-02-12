import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MovieService } from '../../app/services/movies';
import { TvDetailPage } from '../tv-detail/tv-detail';

@IonicPage()
@Component({
  selector: 'page-movie-tv',
  templateUrl: 'movie-tv.html',
})
export class MovieTvPage implements OnInit{

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private movieService : MovieService, private loadingCtrl : LoadingController) {
  }

  moviesTv : any[] = [];
  type:string;
  emailConfirmed: boolean;
  date : string;

  ngOnInit() {
    const loading = this.loadingCtrl.create({
      content:"Getting info..."
    });
    loading.present();
    this.type = this.navParams.get("action");
    if(this.type ==="movie"){
    this.movieService.getNowPlaying()
    .subscribe(
      data => {
        this.moviesTv = data.results;});
    }else if(this.type ==="tv"){
      this.movieService.getOnAir()
      .subscribe(
        data => {
          this.moviesTv = data.results;})
    }

    this.emailConfirmed = this.navParams.get("email");
    console.log(this.emailConfirmed);
    loading.dismiss();
  }

  onDetail(id : number){
    this.navCtrl.push(TvDetailPage,{id : id, type : this.type} )
  }


}
