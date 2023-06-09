import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-show-qrcode-modal',
  templateUrl: './show-qrcode-modal.component.html',
  styleUrls: ['./show-qrcode-modal.component.scss'],
})

/**
 * Modal that display the space QR code
 */
export class ShowQrcodeModalComponent implements OnInit {
  qrCode = '';

  /**
   * Constructor
   * @param modalController Modal controller
   */
  constructor(private modalController: ModalController,) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    if (this.qrCode == null) {
      this.modalController.dismiss();
    }
  }

  /**
   * Callback to close the modal
   */
  onClose() {
    this.modalController.dismiss();
  }
}
