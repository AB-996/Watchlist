import { Component } from '@angular/core';
import { IonicPage, LoadingController, AlertController } from 'ionic-angular';
import { NgForm, FormControl } from '@angular/forms';
import { AuthService } from '../../app/services/auth';
import firebase from "firebase";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(private authService : AuthService, private loadingCtrl : LoadingController,
              private alertCtrl: AlertController) {
  }
  passInvalid : boolean = false;

  onSignup(form : NgForm, pass : FormControl, passC : FormControl){
    const loading = this.loadingCtrl.create({
      content: "Signin you up!"
    })
    if(form.value.pass != form.value.passConfirm){
      this.passInvalid = true;
      pass.reset();
      pass.invalid;
      passC.reset();
      passC.invalid;
      return;
    }
    this.passInvalid = false;
    loading.present();
    this.authService.createUser(form.value.email, form.value.pass)
    .then(
      data => {
        loading.dismiss();
        form.reset();
        firebase.auth().onAuthStateChanged(user => {
          user.sendEmailVerification()
        })}
      )
    .catch(
      error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: "Signup failed!",
          message: error.message,
          buttons: ["OK"]
        });
        alert.present();
      });
  }

}
