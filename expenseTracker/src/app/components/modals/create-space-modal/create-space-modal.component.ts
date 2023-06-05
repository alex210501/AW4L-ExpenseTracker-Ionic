import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { Space } from 'src/app/models/space';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-create-space-modal',
  templateUrl: './create-space-modal.component.html',
  styleUrls: ['./create-space-modal.component.scss'],
})
export class CreateSpaceModalComponent  implements OnInit {
  isNewSpace = false;
  spaceId = '';
  spaceName = '';
  spaceDescription = '';

  constructor(
    private modalController: ModalController, 
    private apiService: ApiService,
    private dataService: DataService,
    ) { }

  ngOnInit() {
    if (this.spaceId == null) {
      this.isNewSpace = true;
    } else {
      console.log(this.spaceId);
      const space = this.dataService.findSpaceById(this.spaceId) ?? null;
      console.log(space);

      this.spaceName = space?.space_name ?? '';
      this.spaceDescription = space?.space_description ?? '';
      console.log(this.spaceName);
    }
  }

  onCreate() {
    if (this.isNewSpace) {
      this.apiService.createSpace(this.spaceName, this.spaceDescription)
        .subscribe(result => this.modalController.dismiss(result as Space, 'confirm'));
    } else {
      const space = this.dataService.findSpaceById(this.spaceId);

      // Set parameters
      space!.space_name = this.spaceName;
      space!.space_description = this.spaceDescription;

      this.apiService.patchSpace(space!)
        .subscribe((a) => this.modalController.dismiss(space, 'confirm'));
    }
  }

  onCancel() {
    return this.modalController.dismiss(null, 'cancel');
  }
}
