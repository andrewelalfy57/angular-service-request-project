import { Routes } from '@angular/router';
import { RequestLocationComponent } from './request-location/request-location.component';
import { RequestFollowUpComponent } from './request-follow-up/request-follow-up.component';

export const routes: Routes = [
  { path: '', component: RequestLocationComponent }, // Default route
  { path: 'request-location', component: RequestLocationComponent },
  { path: 'request-follow-up', component: RequestFollowUpComponent }, // Follow-up page
];
