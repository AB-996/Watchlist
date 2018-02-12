import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { WatchlistPage } from '../watchlist/watchlist';
import { FavoritesPage } from '../favorites/favorites';
import { SearchPage } from '../search/search';



@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  watchlistPage = WatchlistPage;
  favoritesPage = FavoritesPage;
  searchPage = SearchPage;

}
