import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { WatchlistPage } from '../pages/watchlist/watchlist';
import { FavoritesPage } from '../pages/favorites/favorites';
import { SearchPage } from '../pages/search/search';
import { MoviePage } from '../pages/movie/movie';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import { MoviePopPage } from '../pages/movie-pop/movie-pop';
import { SignupPage } from '../pages/signup/signup';
import { SigninPage } from '../pages/signin/signin';
import { MaxLengthPipe } from './pipes/length-pipe';
import { MovieService } from './services/movies';
import { AuthService } from './services/auth';
import { MovieTvPage } from '../pages/movie-tv/movie-tv';
import { TvDetailPage } from '../pages/tv-detail/tv-detail';
import {InfoPage } from '../pages/info/info';
import {FaqPage} from "../pages/faq/faq";
import {Ionic2RatingModule} from "ionic2-rating";
import {AngularFireModule} from "angularfire2";
import {AngularFireDatabaseModule} from "angularfire2/database";
import { RecommendedPage } from '../pages/recommended/recommended';
import {IonicStorageModule} from "@ionic/storage";

const fireconfig = {
  apiKey: "AIzaSyCBfySYNduOCVWpC0-3ITiJilB7mPDQWyo",
  authDomain: "watchlist-83bee.firebaseapp.com",
  databaseURL: "https://watchlist-83bee.firebaseio.com",
  projectId: "watchlist-83bee",
  storageBucket: "watchlist-83bee.appspot.com",
  messagingSenderId: "495494645106"};

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    WatchlistPage,
    FavoritesPage,
    SearchPage,
    MoviePage,
    MaxLengthPipe,
    MoviePopPage,
    SignupPage,
    SigninPage,
    MovieTvPage,
    TvDetailPage,
    InfoPage,
    FaqPage,
    RecommendedPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    Ionic2RatingModule,
    AngularFireModule.initializeApp(fireconfig),
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    WatchlistPage,
    FavoritesPage,
    SearchPage,
    MoviePage,
    MoviePopPage,
    SignupPage,
    SigninPage,
    MovieTvPage,
    TvDetailPage,
    InfoPage,
    FaqPage,
    RecommendedPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MovieService,
    AuthService,
    InAppBrowser
  ]
})
export class AppModule {}
