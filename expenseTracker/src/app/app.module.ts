import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateSpaceModalComponent } from './components/modals/create-space-modal/create-space-modal.component';
import { EditExpenseModalComponent } from './components/modals/edit-expense-modal/edit-expense-modal.component';
import { ExpenseDetailComponent } from './components/expense-details/expense-details.component';
import { JoinSpaceModalComponent } from './components/modals/join-space-modal/join-space-modal.component';
import { LoginComponent } from './components/login/login.component';
import { ShowQrcodeModalComponent } from './components/modals/show-qrcode-modal/show-qrcode-modal.component';
import { SpacesComponent } from './components/spaces/spaces.component';
import { UserSpaceComponent } from './components/user-space/user-space.component';

@NgModule({
  declarations: [
    AppComponent, 
    CreateSpaceModalComponent,
    EditExpenseModalComponent,
    ExpenseDetailComponent,
    JoinSpaceModalComponent,
    LoginComponent, 
    ShowQrcodeModalComponent,
    SpacesComponent,
    UserSpaceComponent,
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    FormsModule, 
    HttpClientModule, 
    QRCodeModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
