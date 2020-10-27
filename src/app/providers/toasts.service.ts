import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastsService {

  constructor(public toastController: ToastController) {}

  async mostrarToast(texto: string, tipo: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000,
      color: tipo
    });
    toast.present();
  }

}
