import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalController } from '@ionic/angular';

import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { Category } from 'src/app/models/category';
import { DataService } from 'src/app/services/data.service';
import { EditExpenseModalComponent } from '../modals/edit-expense-modal/edit-expense-modal.component';
import { ShowQrcodeModalComponent } from '../modals/show-qrcode-modal/show-qrcode-modal.component';
import { Space } from 'src/app/models/space';
import { Expense } from 'src/app/models/expense';

@Component({
  selector: 'app-user-space',
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.scss']
})

/**
 * Screen to display the expenses
 */
export class UserSpaceComponent {
  spaceId = '';
  space?: Space;
  expenses: Expense[] = [];
  expense?: Expense;
  expenseToEdit?: Expense;
  category?: Category;
  editMode = false;

  /**
   * Constructor
   * @param alertService Service to shows an alert
   * @param route Get the parameters passed to the route
   * @param location Access the route history
   * @param modalController Modal controller
   * @param router Used to change the route
   * @param apiService Service to access the API
   * @param dataService Access the shared data
   */
  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private location: Location,
    private modalController: ModalController,
    private router: Router,
    private apiService: ApiService,
    public dataService: DataService,
  ) { }

  /**
   * Get the total expenses of the space
   * @param username Username, optional
   * @returns Total expenses in euros
   */
  getTotalExpenses(username: string | null = null): number {
    return this.dataService.expenses.reduce((acc, expense) => {
      if (username == null || username == expense.expense_paid_by) {
        return acc + expense.expense_cost;
      }

      return acc;
    }, 0);
  }

  /**
   * Get total expenses for the current user
   * @returns Total expenses in euros
   */
  getTotalExpensesUser = () => this.getTotalExpenses(this.dataService.username);

  /**
   * Callback when the expenses are refreshed
   * @param event Event that happended
   */
  onRefresh(event: any) {
    this.apiService.getExpensesFromSpaceId(this.spaceId,
      (err) => {
        this.alertService.apiErrorAlert(err);
        event.target.complete();
      })
      .subscribe(expenses => {
        this.dataService.expenses = expenses;
        event.target.complete();
      });
  }

  /**
   * Initialize components
   */
  ngOnInit() {
    // Get space ID from path
    this.spaceId = this.route.snapshot.paramMap.get('space_id') ?? '';

    // Clear the expenses array from dataService
    this.dataService.clearExpenses();

    // Get new expenses from API
    this.apiService.getExpensesFromSpaceId(this.spaceId,
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe(expenses => this.dataService.expenses = expenses);

    // Get category from API
    this.apiService.getCategoriesFromSpace(this.spaceId,
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe(categories => this.dataService.categories = categories);

    // Get space from its ID
    this.space = this.dataService.findSpaceById(this.spaceId);
  }

  /**
   * Callback to access the expense information
   * @param expenseId ID of the expense
   */
  onExpense(expenseId: string) {
    this.expense = this.dataService.findExpenseById(expenseId) as Expense;

    if (this.expense) {
      // this.category = this.dataService.findCategoryById(this.expense.expense_category ?? '');
      this.expenseToEdit = new Expense(this.expense);
      this.router.navigate([`space/${this.spaceId}/expense/${this.expense.expense_id}`])
    }
  }

  /**
   * Callback to open a dialog to create an expense
   */
  async openCreateExpenseDialog() {
    const modal = await this.modalController.create({
      component: EditExpenseModalComponent,
      componentProps: { spaceId: this.spaceId, expenseId: null },
    });

    // Open
    modal.present();

    /// Get new expense
    const { data, role } = await modal.onWillDismiss();

    if (role === 'valid' && data) {
      this.dataService.expenses.unshift(data);
    }
  }

  /**
   * Callback to go to the previous screen
   */
  goBack() {
    this.location.back();
  }

  /**
   * Callback to delete a space
   * @param spaceId ID of the space
   */
  onDelete(spaceId: string) {
    this.apiService.deleteExpense(this.spaceId, spaceId,
      (err) => this.alertService.apiErrorAlert(err))
      .subscribe(_ => {
        this.router.navigate([`space/${this.spaceId}`]);
        this.dataService.removeExpenseById(spaceId);
        this.expense = undefined;
      });
  }

  /**
   * Callback to show the QR code of the space
   */
  async showQrCode() {
    const modal = await this.modalController.create({
      component: ShowQrcodeModalComponent,
      componentProps: { qrCode: this.spaceId },
    });

    // Open
    modal.present();
  }
}
