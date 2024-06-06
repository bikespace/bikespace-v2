import React from 'react';
import {LocationLatLng} from '@/interfaces/Submission';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import {LeafletMouseEventHandlerFn} from 'leaflet';
import {useMapEvent} from 'react-leaflet';

import * as styles from './location.module.scss';

export function Location(props: {
  location: LocationLatLng;
  onLocationChanged: (location: LocationLatLng) => void;
}) {
  return (
    <div className={styles.location}>
      <h2>Where was the problem?</h2>
      <h3>Pin the location</h3>

      <section className={styles.outerMapContainer}>
        <MapContainer
          center={[props.location.latitude, props.location.longitude]}
          zoom={18}
          scrollWheelZoom={false}
          style={{height: '100%'}}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker
            position={[props.location.latitude, props.location.longitude]}
          />
          <MapHandler
            onClick={e => {
              props.onLocationChanged({
                latitude: e.latlng.lat,
                longitude: e.latlng.lng,
              });
            }}
          />
        </MapContainer>
      </section>
    </div>
  );
}

interface MapHandlerProps {
  onClick: LeafletMouseEventHandlerFn;
}

const MapHandler = ({onClick}: MapHandlerProps) => {
  useMapEvent('click', onClick);

  return null;
};
