import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-join-space-modal',
  templateUrl: './join-space-modal.component.html',
  styleUrls: ['./join-space-modal.component.scss'],
})

/**
 * Modal to join a space
 */
export class JoinSpaceModalComponent implements OnInit {
  spaceId = '';

  /**
   * Constructor
   * @param modalController Modal controller
   * @param dataService Access the shared data
   */
  constructor(
    private modalController: ModalController,
    public dataService: DataService,
  ) { }

  /**
   * Initialize components
   */
  ngOnInit() { }

  /**
   * Callback to cancel the join
   * @returns Result of the controller
   */
  onCancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  /**
   * Callback to join the space
   * @returns Result of the controller
   */
  onJoin() {
    return this.modalController.dismiss(this.spaceId, 'confirm');
  }
}
