import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-request-follow-up',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './request-follow-up.component.html',
  styleUrls: ['./request-follow-up.component.css']
})
export class RequestFollowUpComponent implements AfterViewInit {
  map!: google.maps.Map;

  userName = 'John Doe';
  userLocation = 'Your Location';
  userRating = 4;
  status = 1; // Initial status set to "Pending"
  statusLabels = ['Pending', 'In Progress', 'Completed', 'Cancelled', 'Failed', 'Resolved']; // Add status labels

  lat = 0;
  lng = 0;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getUserLocation();
      this.startProgress(); // Start the progress on component initialization
    }
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.initMap();
        },
        (error) => {
          console.error("Error getting location:", error);
          this.initMap();
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      this.initMap();
    }
  }

  initMap(): void {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: this.lat, lng: this.lng },
      zoom: 15
    };

    this.map = new google.maps.Map(document.getElementById("follow-up-map") as HTMLElement, mapOptions);

    new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: this.map,
      title: 'Your Location'
    });
  }

  // Start progressing through the status steps (2-second delay for each step)
  startProgress() {
    let stepIndex = 1; // Start from "Pending"
    const interval = setInterval(() => {
      if (stepIndex < 6) { // We have 5 steps
        this.status = stepIndex; // Update the status to reflect the current step
        stepIndex++;
      } else {
        clearInterval(interval); // Stop after reaching "Resolved"
      }
    }, 2000); // Change state every 2 seconds
  }

  cancelRequest() {
    console.log("Request canceled.");
    this.router.navigate(['/request-location']); // Navigate to the location page
  }

  callUser() {
    console.log("Calling user...");
  }

  // Getter for status label based on current status index
  getStatusLabel() {
    return this.statusLabels[this.status - 1] || 'Unknown';
  }
}
