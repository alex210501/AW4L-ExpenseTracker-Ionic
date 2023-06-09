import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Message } from 'src/app/models/message';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  async apiErrorAlert(error: any) {
    await this.presentAlert(error.error, 'Error');
  }

  async presentAlert(message: Object, header: string, buttonText: string = 'OK') {
    const alert = await this.alertController.create({
      header: header,
      message: (message as Message).msg ?? 'Unkown',
      buttons: [buttonText]
    });

    await alert.present();
  }
}
