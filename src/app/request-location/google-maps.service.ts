import { Injectable, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

declare let google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (isPlatformBrowser(this.platformId)) {
        // Only load Google Maps API in the browser
        if (window['google']) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDIY3TTOGoE7zr_pW2GRMOVF6hj0Nr761I&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = (error) => reject(error);

        document.head.appendChild(script);
      } else {
        reject('Not in a browser environment');
      }
    });
  }
}
