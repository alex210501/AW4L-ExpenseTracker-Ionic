import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Clipboard } from '@capacitor/clipboard';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { Space } from 'src/app/models/space';
import { DataService } from 'src/app/services/data.service';
import { Category } from 'src/app/models/category';
import { SnackbarService } from 'src/app/services/snackbar.service';


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
  newCategory = '';
  newCollaborator = '';
  space?: Space;

  constructor(
    public dataService: DataService,
    private alertService: AlertService,
    private modalController: ModalController, 
    private apiService: ApiService,
    private snackbarService: SnackbarService,
    ) { }

  get isAdmin() { 
    return this.space?.space_admin === this.dataService.username;
  }

  async onCopyId() {
    await Clipboard.write({ string: this.space?.space_id })
      .then(_ => this.snackbarService.presentToast('ID saved to clipboard!'));
  }

  ngOnInit() {
    if (this.spaceId == null) {
      this.isNewSpace = true;
    } else {
      this.space = this.dataService.findSpaceById(this.spaceId);

      this.spaceName = this.space!.space_name ?? '';
      this.spaceDescription = this.space!.space_description ?? '';

      // Load category
      this.apiService.getCategoriesFromSpace(this.spaceId,
        (err) => this.alertService.apiErrorAlert(err))
        .subscribe((categories) => this.dataService.categories = categories);
    }
  }

  onCreate() {
    if (this.isNewSpace) {
      this.apiService.createSpace(this.spaceName, this.spaceDescription,
        (err) => this.alertService.apiErrorAlert(err))
        .subscribe(result => this.modalController.dismiss(result as Space, 'confirm'));
    } else {
      this.space = this.dataService.findSpaceById(this.spaceId);

      // Set parameters
      this.space!.space_name = this.spaceName;
      this.space!.space_description = this.spaceDescription;

      this.apiService.patchSpace(this.space!, (err) => this.alertService.apiErrorAlert(err))
        .subscribe(_ => this.modalController.dismiss(this.space, 'confirm'));
    }
  }

  onDeleteCategory(categoryId: string) {
    this.apiService.deleteCategoryFromSpace(this.spaceId, categoryId, 
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe((_) => this.dataService.removeCategoryById(categoryId));
  }

  onCreateCategory() {
    this.apiService.createCategoryToSpace(this.spaceId, this.newCategory)
      .subscribe((category: Category) => {
        this.dataService.categories.push(category)
        this.newCategory = '';
      });
  }

  onAddCollaborator() {
    this.apiService.addUserToSpace(this.spaceId, this.newCollaborator, 
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe((_) => {
        this.space?.space_collaborators.push(this.newCollaborator);
        this.newCollaborator = '';
      });
  }

  onDeleteCollaborator(username: string) {
    this.apiService.deleteUserFromSpace(this.spaceId, username, 
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe((_) => this.space!.space_collaborators = this.space!.space_collaborators
        .filter((collab) => collab != username));
  }

  onQuitSpace() {
    this.apiService.quitSpace(this.spaceId, err => this.alertService.apiErrorAlert(err))
      .subscribe(_ => {
        this.dataService.removeSpaceById(this.spaceId);
        return this.modalController.dismiss(null, 'remove');
      });
  }

  onCancel() {
    return this.modalController.dismiss(null, 'cancel');
  }
}
