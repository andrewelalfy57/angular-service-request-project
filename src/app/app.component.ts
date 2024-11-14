import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';  // Import RouterModule for routing
import { CommonModule } from '@angular/common';  // Import CommonModule for ngIf, ngFor, etc.
import { RequestLocationComponent } from './request-location/request-location.component';  // Import components
import { RequestFollowUpComponent } from './request-follow-up/request-follow-up.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, RequestLocationComponent, RequestFollowUpComponent],  // Add necessary imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
