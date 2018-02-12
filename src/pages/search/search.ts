import { Component, OnInit} from '@angular/core';
import { IonicPage, LoadingController} from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { MoviePage } from '../movie/movie';
import { MovieService } from '../../app/services/movies';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage implements OnInit{

  dataMedia : any[] = [];
  selectedData : any;
  isFavorite : boolean = false;
  isInWatchlist : boolean = false;
  crew : any;


  ngOnInit(){
    this.dataMedia = [];
  }

  constructor(private movieService : MovieService, private loadingCtrl : LoadingController,
              private navCtrl : NavController){}

  onSearch(form : NgForm){
    this.dataMedia = [];
    const loading = this.loadingCtrl.create({
      content: "Searching..."
    });
    loading.present();
    const movieName = form.value.movieName;
    this.movieService.findData(movieName)
    .subscribe(
      (response) => {
        this.dataMedia = response.results;
      });
      form.reset();
      loading.dismiss();
  }

  onView(dataOfMedia : any){
    console.log(dataOfMedia.id);
    console.log(dataOfMedia.media_type);
    this.navCtrl.push(MoviePage, {id : dataOfMedia.id,  type : dataOfMedia.media_type})
  }

}
