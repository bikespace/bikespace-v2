'use client';

import React, {useEffect, useState, useRef} from 'react';
import Map, {
  GeolocateControl,
  Layer,
  Source,
  NavigationControl,
} from 'react-map-gl/maplibre';
import {trackUmamiEvent} from '@/utils';

// import {Sidebar} from '../sidebar';
import {ParkingLayer} from './ParkingLayer';
import {BikeLaneLayer} from './BikeLaneLayer';

import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './parking-map-page.module.scss';

export function ParkingMapPage() {
  const [defaultLocation, setDefaultLocation] = useState({
    latitude: 43.65322,
    longitude: -79.384452,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setDefaultLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  return (
    <main className={styles.parkingMapPage}>
      <Map
        initialViewState={{
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          zoom: 14,
        }}
        style={{width: '100%', height: '100%'}}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.MAPTILER_API_KEY}`}
      >
        <NavigationControl position="top-left" />
        <GeolocateControl position="top-left" />
        <BikeLaneLayer />
        <ParkingLayer />
      </Map>
    </main>
  );
}
