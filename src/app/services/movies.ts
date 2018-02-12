
import {Http, Response} from "@angular/http";
import "rxjs/Rx";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth";
import * as firebase from "firebase";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from "rxjs/Observable";

@Injectable()
export class MovieService{

    constructor(private http : Http, private authService : AuthService, private db : AngularFireDatabase){

    }

    favorites : any[] = [];

    watchlist : any[] = [];

    ratings : any[] = [];


    findData(data : string){
        return this.http.get("https://api.themoviedb.org/3/search/multi?api_key=6970ed2c9bad6940b7c2c09846e1aee5&language=en-US&query=" + data)
        .map(
            (response : Response) => {return response.json();}
        )
    }

    addToFavorites(movie : any, token : string){
        console.log(movie);
        this.favorites.push(movie);
        const user = this.authService.getActiveUser().uid;
        return this.http.put("https://watchlist-83bee.firebaseio.com/" + user + "/favorites.json?auth=" + token, this.favorites);
    }

    getFavorites(token : string){
        const user = this.authService.getActiveUser().uid;
        return this.http.get("https://watchlist-83bee.firebaseio.com/" + user + "/favorites.json?auth=" + token)
        .map(
            (response : Response)=> {
                const favorites = response.json() ? response.json() : [];
                return favorites;
            })
        .do(
            data => {
                if(data){
                    this.favorites = data;
                }else{
                    this.favorites = [];
                }
            })
    }

    addToWatchlist(movie:any, token : string){
        this.watchlist.push(movie);
        const user = this.authService.getActiveUser().uid;
        this.db.object("users/" + user + "/watchlist").set(this.watchlist);
        // return this.http.put("https://watchlist-83bee.firebaseio.com/" + user + "/watchlist.json?auth=" + token, this.watchlist);
    }
    
    getWatchlist(token : string){
        // const user = this.authService.getActiveUser().uid;
        // return this.http.get("https://watchlist-83bee.firebaseio.com/" + user + "/watchlist.json?auth=" + token)
        // .map(
        //     (response : Response) =>{
        //          const watchlist = response.json() ? response.json() : [];
        //          return watchlist;
        //     })
        // .do(
        //     data => {
        //         if(data){
        //         this.watchlist ="" data;
        //         }else{
        //             this.watchlist = [];
        //         }
        //     }
        // )
        const user = this.authService.getActiveUser().uid;
        return this.db.list<any>("users/" + user+"/watchlist").valueChanges()
        .do(
            data =>{
                if(data){
                    this.watchlist = data;
                }else{
                    this.watchlist = [];
                }
            }
        );
    }

    addRating(data){
        const user = this.authService.getActiveUser().uid;
        this.db.list<any>("users/" + user).set("ratings",data);
    }

    getRatings() : Observable<any[]>{
        const user = this.authService.getActiveUser().uid;
        return this.db.list<any>("users/" + user+ "/ratings").valueChanges()
        .do(data => {
            if(data){
                this.ratings = data;
            }else{
                this.ratings = [];
            }
        })
    }

    isMovieFavorite(data : any){
        return this.favorites.find((item : any) => {
            return data.id === item.id;
        });
    }

    isMovieInWatchlist(data : any){
        return this.watchlist.find((item : any) => {
            return data.id === item.id;
        })
    }

    removeFrom(list : string, index : number, token : string){
        if(list === "watchlist"){
        this.watchlist.splice(index, 1);
        const user = this.authService.getActiveUser().uid;
        return this.http.put("https://watchlist-83bee.firebaseio.com/" + user + "/watchlist.json?auth=" + token, this.watchlist)
        .map((response : Response) =>{return response.json();})
        }else if(list === "favorites"){
           this.favorites.splice(index, 1);
           const user = this.authService.getActiveUser().uid; 
           return this.http.put("https://watchlist-83bee.firebaseio.com/" + user + "/favorites.json?auth=" + token, this.favorites)
           .map((response : Response) => {return response.json();})
        }
    }

    getNowPlaying(){
        return this.http.get("https://api.themoviedb.org/3/movie/now_playing?api_key=6970ed2c9bad6940b7c2c09846e1aee5&language=en-US&page=1")
        .map((response : Response) => {return response.json();})
    }

    getOnAir(){
        return this.http.get("https://api.themoviedb.org/3/tv/on_the_air?api_key=6970ed2c9bad6940b7c2c09846e1aee5&language=en-US&page=1")
        .map((response : Response) => {return response.json();})
    }

    getDetailsTv(id : number){
        return this.http.get("https://api.themoviedb.org/3/tv/" + id + "?api_key=6970ed2c9bad6940b7c2c09846e1aee5&language=en-US")
        .map((response : Response) => {return response.json()})
    }

    getDetailsMovie(id : number){
        return this.http.get("https://api.themoviedb.org/3/movie/" + id + "?api_key=6970ed2c9bad6940b7c2c09846e1aee5&language=en-US")
        .map((response : Response) => {return response.json()})
    }

    getCreditsMovie(id : number){
        return this.http.get("https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=6970ed2c9bad6940b7c2c09846e1aee5")
        .map((response : Response) => {return response.json()})
    }

    getCreditsTv(id : number){
        return this.http.get("https://api.themoviedb.org/3/tv/" + id + "/credits?api_key=6970ed2c9bad6940b7c2c09846e1aee5&language=en-US")
        .map((response : Response) => {return response.json()})
    }

    getRatingsData(token:string){
        return this.http.get("https://watchlist-83bee.firebaseio.com/RatingsData.json/?auth=" + token)
        .map(
            (response : Response) => {return response.json();})
    }
}