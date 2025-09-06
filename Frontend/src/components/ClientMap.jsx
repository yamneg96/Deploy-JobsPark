import React, { useEffect, useRef } from 'react';

const ClientMap = ({ clientLoc, isVisible }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Only initialize the map if the component is visible and the mapRef is available
    if (isVisible && mapRef.current) {
      const { lat, lng } = clientLoc;
      const mapOptions = {
        center: { lat, lng },
        zoom: 12, // Zoom level
      };
      
      const map = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add a marker for the client's location
      new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: "Client's Location",
      });
    }
  }, [isVisible, clientLoc]);

  // The map container div with fixed size
  return (
    <div
      ref={mapRef}
      style={{ width: '400px', height: '400px', display: isVisible ? 'block' : 'none' }}
    />
  );
};

export default ClientMap;