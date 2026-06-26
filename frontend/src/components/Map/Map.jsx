import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// CSS marker indicators for premium visual styling
const createCustomIcon = (color, char) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 12px;">${char}</div>`,
    className: 'custom-map-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const Map = ({ center = [31.6200, 74.8765], zoom = 13, markers = [] }) => {
  // Safe validation check for coordinates
  const validCenter = Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])
    ? center 
    : [31.6200, 74.8765];

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', zIndex: 1, position: 'relative' }}>
      <MapContainer 
        center={validCenter} 
        zoom={zoom} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Premium light themed map
        />
        
        {/* Render markers */}
        {markers.map((marker, idx) => {
          const mColor = marker.type === 'attraction' ? 'var(--color-mustard)' 
                       : marker.type === 'hotel' ? 'var(--color-green)' 
                       : marker.type === 'restaurant' ? 'var(--color-phulkari-pink)'
                       : '#E53E3E'; // Emergency/Hospital red
                       
          const mChar = marker.type === 'attraction' ? '⛩️' 
                      : marker.type === 'hotel' ? '🏨' 
                      : marker.type === 'restaurant' ? '🍽️'
                      : '🚨';
                      
          return (
            <Marker 
              key={idx} 
              position={marker.coords} 
              icon={createCustomIcon(mColor, mChar)}
            >
              <Popup>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{marker.name}</strong>
                  <p style={{ margin: '2px 0 0 0', color: 'var(--text-secondary)' }}>{marker.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
