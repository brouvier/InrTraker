import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FourOhFourComponent } from './components/four-oh-four/four-oh-four.component';
import { LoginComponent } from './components/login/login.component';
import { LogService } from './services/log.service';
import { SecurityService } from './services/security.service';
import { HomeComponent } from './components/home/home.component';
import { DrugService } from './services/drug.service';
import { IntakeListComponent } from './components/intake-list/intake-list.component';
import { ModalEditIntakeComponent } from './components/modal-edit-intake/modal-edit-intake.component';
import { INRService } from './services/inr.service';
import { MeasureListComponent } from './components/measure-list/measure-list.component';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
import { ModalEditInrComponent } from './components/modal-edit-inr/modal-edit-inr.component';

@NgModule({
  declarations: [
    AppComponent,
    FourOhFourComponent,
    LoginComponent,
    HomeComponent,
    IntakeListComponent,
    ModalEditIntakeComponent,
    MeasureListComponent,
    ModalEditInrComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxEchartsModule.forRoot({echarts})
  ],
  providers: [
    LogService,
    SecurityService,
    DrugService,
    INRService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
