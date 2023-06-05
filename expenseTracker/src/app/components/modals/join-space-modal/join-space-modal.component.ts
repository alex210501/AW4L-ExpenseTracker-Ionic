import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-join-space-modal',
  templateUrl: './join-space-modal.component.html',
  styleUrls: ['./join-space-modal.component.scss'],
})
export class JoinSpaceModalComponent  implements OnInit {
  spaceId = '';

  constructor(
    private modalController: ModalController,
    public dataService: DataService,
    ) { }

  ngOnInit() {}

  onCancel() {
    return this.modalController.dismiss(null, 'cancel');
  }

  onJoin() {
    return this.modalController.dismiss(this.spaceId, 'confirm');
  }
}
