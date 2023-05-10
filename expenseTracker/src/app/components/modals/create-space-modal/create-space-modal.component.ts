import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { Space } from 'src/app/models/space';


@Component({
  selector: 'app-create-space-modal',
  templateUrl: './create-space-modal.component.html',
  styleUrls: ['./create-space-modal.component.scss'],
})
export class CreateSpaceModalComponent  implements OnInit {
  spaceName = '';
  spaceDescription = '';

  constructor(
    private modalController: ModalController, 
    private apiService: ApiService,
    ) { }

  ngOnInit() {}

  onCreate() {
    this.apiService.createSpace(this.spaceName, this.spaceDescription)
      .subscribe(result => this.modalController.dismiss(result as Space, 'confirm'));
  }

  onCancel() {
    return this.modalController.dismiss(null, 'cancel');
  }
}
