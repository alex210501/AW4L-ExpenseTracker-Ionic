import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { Credentials } from '../models/credentials';
import { Collaborator } from '../models/collaborator';
import { Expense } from '../models/expense';
import { Space } from '../models/space';
import { Token } from '../models/token';
import { User } from '../models/user';
import { Category } from '../models/category';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};
const URL = 'https://alejandro-borbolla.com/expensestracker/api';
const LOGIN_URL = `${URL}/auth/login`;
const LOGOUT_URL = `${URL}/logout`;

// User Management
const CREATE_USER_URL = `${URL}/user`;

// Space
const SPACES_URL = `${URL}/space`;
const SPACE_ID_URL = `${URL}/space/:space_id`;

// Expense
const EXPENSE_URL = `${URL}/space/:space_id/expense`;
const EXPENSE_ID_URL = `${URL}/space/:space_id/expense/:expense_id`;

// Category
const CATEGORY_URL = `${URL}/space/:space_id/category`;
const CATEGORY_ID_URL = `${URL}/space/:space_id/category/:category_id`;

// Space User
const SPACE_USER_URL = `${URL}/space/:space_id/user`;
const SPACE_USER_ID_URL = `${URL}/space/:space_id/user/:username`;
const SPACE_JOIN_URL = `${URL}/space/:space_id/join`;
const SPACE_QUIT_URL = `${URL}/space/:space_id/quit`;

// Define the ErrorCallback type
type ErrorCallback = (error: any) => void;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private token = '';

  constructor(private http: HttpClient) { }

  private handleError(error: any, errorCallback?: ErrorCallback): Observable<never> {
    if (errorCallback) {
      errorCallback(error);
    }

    console.error('An error occurred:', error);

    return of();
  }

  login(credentials: Credentials, errorCallback?: ErrorCallback) {
    return this.http.post<Token>(LOGIN_URL, JSON.stringify(credentials), httpOptions).pipe(
      tap(token => {
        this.token = token.token;
        httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${this.token}`);
      }),
      catchError((err) => this.handleError(err, errorCallback)),
    );
  }

  logout(errorCallback?: ErrorCallback) {
    return this.http.post(LOGOUT_URL, {}, httpOptions)
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  createUser(user: User, errorCallback?: ErrorCallback) {
    return this.http.post<User>(CREATE_USER_URL, JSON.stringify(user), httpOptions).pipe(
      tap(_ => console.log('User created')),
      catchError((err) => this.handleError(err, errorCallback)),
    );
  }

  getSpaces(errorCallback?: ErrorCallback): Observable<Space[]> {
    return this.http.get<Space[]>(SPACES_URL, httpOptions)
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  getSpaceById(spaceId: string, errorCallback?: ErrorCallback): Observable<Space> {
    return this.http.get<Space>(
      SPACE_ID_URL.replace(':space_id', spaceId),
      httpOptions
      ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  createSpace(spaceName: string, spaceDescription: string, 
    errorCallback?: ErrorCallback): Observable<Object> {
    const spaceJson = {
      space_name: spaceName,
      space_description: spaceDescription,
    };

    return this.http.post(SPACES_URL, spaceJson, httpOptions)
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  patchSpace(space: Space, errorCallback?: ErrorCallback): Observable<Space> {
    const spaceJson = {
      space_name: space.space_name,
      space_description: space.space_description,
    };

    console.log(spaceJson);

    return this.http.patch<Space>(
      SPACE_ID_URL.replace(':space_id', space.space_id),
      spaceJson,
      httpOptions,
    )
    .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  deleteSpace(spaceId: string, errorCallback?: ErrorCallback) {
    return this.http.delete(
      SPACE_ID_URL.replace(':space_id', spaceId),
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  getExpensesFromSpaceId(spaceId: string, errorCallback?: ErrorCallback): Observable<Expense[]> {
    return this.http.get<Expense[]>(EXPENSE_URL.replace(':space_id', spaceId), httpOptions)
      .pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  createExpense(
    spaceId: string, 
    expenseDescription: 
    string, expenseCost: number, 
    errorCallback?: ErrorCallback): Observable<Expense> {
    const expenseJson = {
      expense_description: expenseDescription,
      expense_cost: expenseCost,
    };

    return this.http.post<Expense>(
      EXPENSE_URL.replace(':space_id', spaceId), 
      expenseJson, 
      httpOptions).pipe(
        catchError((err) => this.handleError(err, errorCallback)),
      );
  }

  patchExpense(spaceId: string, expense: Expense, 
    errorCallback?: ErrorCallback): Observable<Map<string, string>> {
    let expenseJson = {
      expense_description: expense.expense_description,
      expense_cost: expense.expense_cost,
      expense_category: expense.expense_category ?? null,
    };
    console.log(expense.expense_category);
    return this.http.patch<Map<string, string>>(
      EXPENSE_ID_URL.replace(':space_id', spaceId).replace(':expense_id', expense.expense_id),
      expenseJson, 
      httpOptions).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  deleteExpense(spaceId: string, expenseId: string, errorCallback?: ErrorCallback): Observable<Expense> {
    return this.http.delete<Expense>(
      EXPENSE_ID_URL.replace(':space_id', spaceId).replace(':expense_id', expenseId), 
      httpOptions).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  getCategoriesFromSpace(spaceId: string, errorCallback?: ErrorCallback): Observable<Category[]> {
    return this.http.get<Category[]>(
      CATEGORY_URL.replace(':space_id', spaceId),
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  createCategoryToSpace(spaceId: string, categoryTitle: string, errorCallback?: ErrorCallback): Observable<Category> {
    return this.http.post<Category>(
      CATEGORY_URL.replace(':space_id', spaceId),
      { category_title: categoryTitle },
      httpOptions
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  deleteCategoryFromSpace(spaceId: string, 
    categoryId: string, 
    errorCallback?: ErrorCallback): Observable<Category> {
    return this.http.delete<Category>(
      CATEGORY_ID_URL.replace(':space_id', spaceId).replace(':category_id', categoryId),
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  addUserToSpace(spaceId: string, 
    username: string, 
    errorCallback?: ErrorCallback): Observable<Collaborator> {
    return this.http.post<Collaborator>(
      SPACE_USER_URL.replace(':space_id', spaceId),
      { username },
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  deleteUserFromSpace(spaceId: string, username: string, errorCallback?: ErrorCallback): Observable<Object> {
    return this.http.delete(
      SPACE_USER_ID_URL.replace(':space_id', spaceId).replace(':username', username),
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  joinSpace(spaceId: string, errorCallback?: ErrorCallback): Observable<Collaborator> {
    return this.http.post<Collaborator>(
      SPACE_JOIN_URL.replace(':space_id', spaceId),
      null,
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }

  quitSpace(spaceId: string, errorCallback?: ErrorCallback): Observable<Collaborator> {
    return this.http.post<Collaborator>(
      SPACE_QUIT_URL.replace(':space_id', spaceId),
      null,
      httpOptions,
    ).pipe(catchError((err) => this.handleError(err, errorCallback)));
  }
}
