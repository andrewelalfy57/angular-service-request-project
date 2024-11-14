import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { GoogleMapsService } from './google-maps.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

declare var google: any;

@Component({
  selector: 'app-request-location',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './request-location.component.html',
  styleUrls: ['./request-location.component.css'],
  animations: [
    trigger('state', [
      state('done', style({
        opacity: 1,
      })),
      transition('void => done', [
        animate('300ms 0ms')
      ])
    ])
  ]
})export class RequestLocationComponent implements OnInit {
  map: any;
  marker: any;
  services: string[] = [];
  serviceMarkers: any[] = [];
  selectedLocation: any = null;
  selectedService: string | null = null;
  selectedServiceLocation: any = null; 
  servicesReady: boolean = false;
  serviceListVisible: boolean = false; 

  constructor(
    private googleMapsService: GoogleMapsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.googleMapsService.load().then(() => {
        this.initializeMap();
        this.servicesReady = true;
      }).catch((error) => {
        console.error('Error loading Google Maps API:', error);
        this.servicesReady = true;
      });
    }
  }

  navigateToFollowUp() {
    this.router.navigate(['/request-follow-up']); 
  }

  initializeMap() {
    const mapOptions = { center: { lat: 37.7749, lng: -122.4194 }, zoom: 12 };
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          this.map.setCenter(userLocation);
          new google.maps.Marker({ position: userLocation, map: this.map, title: 'Your Location' });
        },
        (error) => {
          console.warn('Error retrieving location:', error);
        }
      );
    }

    this.map.addListener('click', (event: any) => {
      this.placePin(event.latLng);
    });
  }

  placePin(location: any) {
    if (this.marker) {
      this.marker.setMap(null);
    }
    this.updateServices(location);
    this.serviceListVisible = true;  // Show the service list when a location is selected
  
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: 'Selected Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    });
  
    this.selectedLocation = location;
    this.selectedService = null;  // Deselect any service when a new location is selected
    this.selectedServiceLocation = null; // Reset selected service location
  
    this.displayRandomServiceLocations();  // Display services around selected location
  }
  

 
  getServiceImage(service: string): string {
    const serviceImages: { [key: string]: string } = {
      'Electricity': 'electricity.jpg',
      'Plumbing': 'plumbing.png',
      'Gardening': 'garden.jpg',
      'Cleaning': 'clean.jpg',
      'Auditing': 'audit.jpg',
      'Car Cleaning': 'car.jpg',
      'House painting': 'paint.jpg',
      'Dog Petting': 'dog.jpg'
    };
  
    return serviceImages[service] || 'assets/icons/default_service.png';  // Default image if not found
  }
  
  

  updateServices(location: any) {
    const serviceOptions = ['Electricity', 'Plumbing', 'Gardening', 'Cleaning', 'Auditing', 'Car Cleaning', 'House painting', 'Dog Petting'];
    this.services = [];
    while (this.services.length < 2) {
      const randomService = serviceOptions[Math.floor(Math.random() * serviceOptions.length)];
      if (!this.services.includes(randomService)) {
        this.services.push(randomService);
      }
    }
  
    console.log("Available services:", this.services); 
    this.cdr.detectChanges();
  }

  displayRandomServiceLocations() {
    this.serviceMarkers.forEach(marker => marker.setMap(null));
    this.serviceMarkers = [];

    this.services.forEach(service => {
      const randomLocations = this.generateRandomLocations(this.selectedLocation, 5, 3); 

      randomLocations.forEach(location => {
        const marker = new google.maps.Marker({
          position: location,
          map: this.map,
          title: `${service} Available`,
          icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        });

        marker.addListener('click', () => {
          this.selectServiceLocation(location, service); 
        });

        this.serviceMarkers.push(marker);
      });
    });
  }

  generateRandomLocations(baseLocation: any, radiusInKm: number, numLocations: number) {
    const locations = [];
    const radius = radiusInKm * 1000;
    const baseLat = baseLocation.lat();
    const baseLng = baseLocation.lng();

    for (let i = 0; i < numLocations; i++) {
      const randomLat = baseLat + (Math.random() - 0.5) * (radius / 111320); 
      const randomLng = baseLng + (Math.random() - 0.5) * (radius / (111320 * Math.cos(baseLat * Math.PI / 180))); 
      locations.push({ lat: randomLat, lng: randomLng });
    }
    return locations;
  }

  selectServiceLocation(location: any, service: string) {
    this.selectedServiceLocation = location;  
    this.selectedService = service;  

    this.cdr.detectChanges();
  }

  onSelectService() {
    if (this.selectedService) {
      this.router.navigate(['/request-follow-up'], {
        queryParams: {
          service: this.selectedService,
          location: JSON.stringify(this.selectedLocation)
        }
      });
    }
  }

  clearSelection() {
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }
    this.selectedLocation = null;
    this.services = [];
    this.selectedService = null;  // Reset selected service
    this.selectedServiceLocation = null; // Reset selected service location
    this.serviceListVisible = false;  // Hide service list when selection is cleared
  
    // Clear service markers
    this.serviceMarkers.forEach(marker => marker.setMap(null));
    this.serviceMarkers = [];
  }
  
}
