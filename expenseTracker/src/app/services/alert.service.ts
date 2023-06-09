import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Message } from 'src/app/models/message';

@Injectable({
  providedIn: 'root'
})

/**
 * Show an alert
 */
export class AlertService {
  /**
   * Constructor
   * @param alertController Alret controller
   */
  constructor(private alertController: AlertController) { }

  /**
   * Show an alert with an error
   * @param error Error to show
   */
  async apiErrorAlert(error: any) {
    await this.presentAlert(error.error, 'Error');
  }

  /**
   * Open an alert
   * @param message Message to display 
   * @param header Header of the alert, optional
   * @param buttonText Text of the alert button, optional
   */
  async presentAlert(message: Object, header: string, buttonText: string = 'OK') {
    const alert = await this.alertController.create({
      header: header,
      message: (message as Message).msg ?? 'Unkown',
      buttons: [buttonText]
    });

    await alert.present();
  }
}
