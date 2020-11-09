import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TableModule} from 'primeng/table';
import {RatingModule} from 'primeng/rating';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { ChartModule } from 'primeng/chart';
import {CarouselModule} from 'primeng/carousel';
import {MultiSelectModule} from 'primeng/multiselect';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {DialogModule} from 'primeng/dialog';
import { DialoguesComponent } from './dialogues/dialogues.component';
import { MessageService } from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
@NgModule({
  declarations: [
    AppComponent,
    DialoguesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    RatingModule,
    ChartModule,
    CarouselModule,
    TooltipModule,
    TabViewModule,
    MultiSelectModule,
    ButtonModule,
    BrowserAnimationsModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    AppRoutingModule
  ],
  providers: [
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
