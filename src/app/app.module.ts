import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Import the routing module
import { RequestLocationComponent } from './request-location/request-location.component';
import { RequestFollowUpComponent } from './request-follow-up/request-follow-up.component';

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    RequestLocationComponent, // Declare the components
    RequestFollowUpComponent,
    BrowserModule,
    AppRoutingModule,  // Include routing module here
  ],
  providers: [],
})
export class AppModule {}
