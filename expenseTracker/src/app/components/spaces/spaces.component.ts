import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { CreateSpaceModalComponent } from '../modals/create-space-modal/create-space-modal.component';
import { JoinSpaceModalComponent } from '../modals/join-space-modal/join-space-modal.component';
import { Space } from 'src/app/models/space';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss']
})
export class SpacesComponent {
  constructor(
    private router: Router, 
    private apiService: ApiService, 
    private modalController: ModalController,
    public dataService: DataService,
    ) {}

  ngOnInit() {
    this.apiService.getSpaces().subscribe(spaces => this.dataService.spaces = spaces);
  }

  onSpace(spaceId: string) {
    this.router.navigate([`space/${spaceId}`]);
  }

  async onEdit(event: MouseEvent, spaceId: string) {
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: CreateSpaceModalComponent,
      componentProps: { spaceId },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'confirm' && data) {
      this.dataService.editSpace(data);
    }
  }

  onDelete(spaceId: string) {
    // event.stopPropagation();
    this.apiService.deleteSpace(spaceId).subscribe(_ => {
      this.dataService.removeSpaceById(spaceId);
    });
  }

  async openCreateSpaceModal() {
    const modal = await this.modalController.create({
      component: CreateSpaceModalComponent,
      componentProps: { spaceId: null },
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'confirm' && data) {
      this.dataService.spaces.push(data);
    }
  }

  async openJoinSpaceModal() {
    const modal = await this.modalController.create({component: JoinSpaceModalComponent});

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'confirm' && data) {
      this.apiService.joinSpace(data).subscribe((_) => {
        this.apiService.getSpaceById(data)
          .subscribe((space) => this.dataService.spaces.push(space));
      });
    }
  }
}
