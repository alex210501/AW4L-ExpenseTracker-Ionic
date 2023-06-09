import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { EditExpenseModalComponent } from '../modals/edit-expense-modal/edit-expense-modal.component';
import { Expense } from 'src/app/models/expense';
import { Category } from 'src/app/models/category';


@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})

/**
 * Screen that show the details of an expense
 */
export class ExpenseDetailComponent {
  spaceId = '';
  expense?: Expense;
  category: Category | null = null;
  categoriesSelect: (Category | null)[] = [];
  editMode = false;

  /**
   * Constructor
   * @param alertService Service to display an alert
   * @param route Used to get the parameters passed to the route
   * @param location Used to get the history location
   * @param modalController Control de modals
   * @param router Used to change the route
   * @param apiService Service to access the API
   * @param dataService Access to the shared data
   */
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private location: Location,
    private modalController: ModalController,
    private router: Router,
    private apiService: ApiService,
    public dataService: DataService
  ) { }

  /**
   * Initialize components
   */
  ngOnInit() {
    // Get space and expense ID from path
    this.spaceId = this.route.snapshot.paramMap.get('space_id') ?? '';
    const expenseId = this.route.snapshot.paramMap.get('expense_id') ?? '';

    // Get expense and category
    this.expense = this.dataService.findExpenseById(expenseId);
    this.categoriesSelect = [null, ...this.dataService.categories];
    this.category = this.dataService.findCategoryById(this.expense?.expense_category ?? '');
  }

  /**
   * Callback to edit the expense
   */
  async onEdit() {
    const modal = await this.modalController.create({
      component: EditExpenseModalComponent,
      componentProps: { spaceId: this.spaceId, expenseId: this.expense?.expense_id },
    });

    // Open
    modal.present();

    /// Get new expense
    const { data, role } = await modal.onWillDismiss();

    if (role === 'valid' && data) {
      this.apiService.patchExpense(this.spaceId, data,
        (err) => this.alertService.apiErrorAlert(err))
        .subscribe((_) => {
          this.dataService.editExpense(data);
          this.expense = data;
        });
    }
  }

  /**
   * Callback to delete the expense
   */
  onDelete() {
    if (this.expense) {
      this.apiService.deleteExpense(this.spaceId, this.expense.expense_id,
        (err) => this.alertService.apiErrorAlert(err))
        .subscribe(_ => this.router.navigate([`space/${this.spaceId}`]));
    }
  }

  /**
   * Go back to the previous screen
   */
  goBack() {
    this.location.back();
  }
}