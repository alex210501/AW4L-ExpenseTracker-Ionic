import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import { Expense } from 'src/app/models/expense';


@Component({
  selector: 'app-edit-expense-modal',
  templateUrl: './edit-expense-modal.component.html',
  styleUrls: ['./edit-expense-modal.component.scss'],
})
export class EditExpenseModalComponent  implements OnInit {
  isNewExpense = false;
  spaceId = '';
  expenseId = '';
  expenseDescription = '';
  expenseCost = 0.0;

  constructor(
    private modalController: ModalController, 
    private apiService: ApiService,
    public dataService: DataService,
    ) { }

  ngOnInit() {
    // If an expenseId has been passed, retrieve its arguments
    if (this.expenseId != null) {
      this.isNewExpense = false;
      const expense = this.dataService.findExpenseById(this.expenseId);

      // Load arguments
      this.expenseDescription = expense?.expense_description ?? '';
      this.expenseCost = expense?.expense_cost ?? 0.0;
    } else {
      this.isNewExpense = true;
    }
  }

  onEdit() {
    if (this.isNewExpense) {
      this.apiService.createExpense(this.spaceId, this.expenseDescription, this.expenseCost)
        .subscribe(result => this.modalController.dismiss(result as Expense, 'valid'));
    }
  }

  onCancel() {
    return this.modalController.dismiss(null, 'cancel');
  }
}
