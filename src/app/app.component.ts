import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage } from '../pages/signup/signup';
import firebase from "firebase";
import { SigninPage } from '../pages/signin/signin';
import { AuthService } from './services/auth';
import { MovieTvPage } from '../pages/movie-tv/movie-tv';
import { InfoPage } from '../pages/info/info';
import { FaqPage } from '../pages/faq/faq';
import { RecommendedPage } from '../pages/recommended/recommended';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  isAuthenticated = false;
  emailConfirmed : boolean = false;
  ratings;

  @ViewChild("nav") navCtrl : NavController;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private authService : AuthService) {
    platform.ready().then(() => {
      firebase.initializeApp({
        apiKey: "AIzaSyCBfySYNduOCVWpC0-3ITiJilB7mPDQWyo",
        authDomain: "watchlist-83bee.firebaseapp.com",
        databaseURL: "https://watchlist-83bee.firebaseio.com",
        projectId: "watchlist-83bee",
        storageBucket: "watchlist-83bee.appspot.com",
        messagingSenderId: "495494645106"});
      
        firebase.auth().onAuthStateChanged(
          user => {
            if(user){
              this.isAuthenticated = true;
              this.rootPage = TabsPage;
              this.emailConfirmed = user.emailVerified;
            }else{
              this.isAuthenticated = false;
              this.rootPage = SignupPage;
            }
          }
        )
      statusBar.styleDefault();
      splashScreen.hide();
    });



  }

  onSignup(){
    this.navCtrl.push(SignupPage);
  }


  onLogout(){
    this.isAuthenticated = false;
    this.authService.logout();
  }

  onLogin(){
    this.navCtrl.push(SigninPage);
  }

  nowPlaying(){
    this.navCtrl.push(MovieTvPage, {action : "movie", email : this.emailConfirmed});
  }

  nowAiring(){
    this.navCtrl.push(MovieTvPage, {action : "tv", email : this.emailConfirmed});
  }

  onHome(){
    this.navCtrl.push(TabsPage);
  }

  onInfo(){
    this.navCtrl.push(InfoPage);
  }

  onFaq(){
    this.navCtrl.push(FaqPage);
  }

  recommended(){
    this.navCtrl.push(RecommendedPage);
  }


}

