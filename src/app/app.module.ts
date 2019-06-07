import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatGridListModule,
        MatIconModule,
        MatCardModule,
        MatExpansionModule,
        MatListModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule} from '@angular/material';
import { DisplayZoneComponent, ShowNotesDialogComponent } from './combat-zone/display-zone/display-zone.component';
import { CombatZoneComponent } from './combat-zone/combat-zone.component';
import { HeaderComponent, AddBuildDialogComponent } from './header/header.component';
import { VitalsChartComponent } from './combat-zone/display-zone/vitals-chart/vitals-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayZoneComponent,
    CombatZoneComponent,
    HeaderComponent,
    AddBuildDialogComponent,
    VitalsChartComponent,
    ShowNotesDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatGridListModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    HttpClientModule
  ],
  entryComponents: [AddBuildDialogComponent, ShowNotesDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
