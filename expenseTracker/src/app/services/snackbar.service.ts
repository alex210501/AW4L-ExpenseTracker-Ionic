import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  duration = 1000;

  constructor(private toastController: ToastController) { }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: this.duration,
      position: 'bottom',
    });

    toast.present();
  }
}
