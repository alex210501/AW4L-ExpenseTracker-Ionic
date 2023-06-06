import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-qrcode-modal',
  templateUrl: './show-qrcode-modal.component.html',
  styleUrls: ['./show-qrcode-modal.component.scss'],
})
export class ShowQrcodeModalComponent  implements OnInit {
  qrCode = '';

  constructor(private modalController: ModalController,) { }

  ngOnInit() {
    if (this.qrCode == null) {
      this.modalController.dismiss();
    }
  }

  onClose() { 
    this.modalController.dismiss();
  }
}
