import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { CreateSpaceModalComponent } from '../modals/create-space-modal/create-space-modal.component';
import { JoinSpaceModalComponent } from '../modals/join-space-modal/join-space-modal.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss']
})

/**
 * Screen that shows the space
 */
export class SpacesComponent {
  constructor(
    private alertService: AlertService,
    private router: Router,
    private apiService: ApiService,
    private modalController: ModalController,
    public dataService: DataService,
  ) { }

  /**
   * Initialize components
   */
  ngOnInit() {
    this.apiService.getSpaces((err) => this.alertService.apiErrorAlert(err))
      .subscribe(spaces => this.dataService.spaces = spaces);
  }

  /**
   * Show the expenses of a space
   * @param spaceId ID of the space
   */
  onSpace(spaceId: string) {
    this.router.navigate([`space/${spaceId}`]);
  }

  /**
   * Callback when the spaces are refreshed
   * @param event Event that happened
   */
  onRefresh(event: any) {
    this.apiService.getSpaces((err) => {
      this.alertService.apiErrorAlert(err);
      event.target.complete();
    }).subscribe(spaces => {
      this.dataService.spaces = spaces;
      event.target.complete();
    });
  }

  /**
   * Callback to edit the space
   * @param event Event that happened
   * @param spaceId ID of the space
   */
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

  /**
   * Callback to delete a space
   * @param spaceId ID of the space
   */
  onDelete(spaceId: string) {
    // event.stopPropagation();
    this.apiService.deleteSpace(spaceId, (err) => this.alertService.apiErrorAlert(err))
      .subscribe(_ => {
        this.dataService.removeSpaceById(spaceId);
      });
  }

  /**
   * Callback to open a modal to create a space
   */
  async openCreateSpaceModal() {
    const modal = await this.modalController.create({
      component: CreateSpaceModalComponent,
      componentProps: { spaceId: null },
    });

    // Open modal
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'confirm' && data) {
      this.dataService.spaces.push(data);
    }
  }

  /**
   * Callback to open a modal to join a space
   */
  async openJoinSpaceModal() {
    const modal = await this.modalController.create({ component: JoinSpaceModalComponent });

    // Open the modal
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role == 'confirm' && data) {
      this.apiService.joinSpace(data, (err) => this.alertService.apiErrorAlert(err))
        .subscribe((_) => {
          this.apiService.getSpaceById(data)
            .subscribe((space) => this.dataService.spaces.push(space));
        });
    }
  }
}
