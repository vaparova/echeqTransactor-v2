import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import auth from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {
  }

  private registrarUsuario(email: string, password: string){
    return this.afAuth.createUserWithEmailAndPassword(email, password).then((res) => {
      console.log('login ok!');
    }).catch(err => console.log(err));
  }

  login(email: string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

}
