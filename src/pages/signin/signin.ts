import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController} from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../app/services/auth';


@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(private authService : AuthService, private loadingCtrl : LoadingController,
              private alertCtrl : AlertController) {
  }

  onLogin(form : NgForm){
    const loading = this.loadingCtrl.create({
      content: "Logging you in..."
    });
    loading.present();
    this.authService.login(form.value.email, form.value.pass)
    .then(
      data => {
        loading.dismiss();})
    .catch(
      error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: "Login failed!",
          message: error.message,
          buttons: ["OK"]});
        alert.present();})
  }
}
