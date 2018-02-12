import firebase from "firebase";

export class AuthService{
    createUser(email: string, password : string){
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    }

    logout(){
        firebase.auth().signOut();
    }

    login(email : string, password : string){
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    getActiveUser(){
        return firebase.auth().currentUser;
    }
}