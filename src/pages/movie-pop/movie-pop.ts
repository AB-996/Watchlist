import { Component } from '@angular/core';
import { IonicPage, ViewController} from 'ionic-angular';
import { MovieService } from '../../app/services/movies';

@IonicPage()
@Component({
  selector: 'page-movie-pop',
  templateUrl: 'movie-pop.html',
})
export class MoviePopPage {

  constructor(private viewCtrl : ViewController){}

  onAction(action : string){
    this.viewCtrl.dismiss({action : action});
  }

}
