import { Component } from '@angular/core';
import { IonicPage,NavParams } from 'ionic-angular';
import { MovieService } from '../../app/services/movies';



@IonicPage()
@Component({
  selector: 'page-tv-detail',
  templateUrl: 'tv-detail.html',
})
export class TvDetailPage {

  data : any;
  type : string;

  constructor( private navParams: NavParams, private movieService : MovieService) {
  }

  ionViewWillEnter(){
    console.log("ušlo");
    const id = this.navParams.get("id");
    this.type = this.navParams.get("type");
    if(this.type === "movie"){
      this.movieService.getDetailsMovie(id)
      .subscribe(response => {this.data = response})
    }else if(this.type === "tv"){
      this.movieService.getDetailsTv(id)
      .subscribe(response => this.data = response)
    }
  }

}
