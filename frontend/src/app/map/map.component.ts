import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, MapOptions, marker, tileLayer } from 'leaflet';
import { LocationService } from '../location.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: Map;
  mapOptions!: MapOptions;
  latitude!: number;
  longitude!: number;

  constructor(private locationService: LocationService){}

  ngOnInit(): void {
      this.initMap();
      this.getLocation();

  }

  initMap(): void {
    this.mapOptions = {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 15,
      center: latLng(0, 0) // Default center until location is loaded
    };
  }

  getLocation(): void {
    this.locationService.getCurrentLocation()
      .then((position: GeolocationPosition) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        // Set map center to user's location
        this.mapOptions.center = latLng(this.latitude, this.longitude);
        this.map = new Map('map', this.mapOptions);

        // Add marker for user's location
        const userMarker = marker([this.latitude, this.longitude]);
        userMarker.addTo(this.map);
      })
      .catch((error) => {
        console.error('Error fetching location:', error);
      });
  }


}
