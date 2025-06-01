import React, { useState } from "react";
import { Map, Marker} from "@vis.gl/react-google-maps";
import Box from "@mui/material/Box"

const CustomMap = () => {
  // shows marker on London by default
  const [markerLocation, setMarkerLocation] = useState({
    lat: 51.509865,
    lng: -0.118092,
  });

  return (
    <Box sx={{
      height: '500px',
      width: '50%',
      border: '2px solid black',
      borderRadius: '20px'
    }}>
      <Map
        style={{ borderRadius: "20px" }}
        defaultZoom={13}
        defaultCenter={markerLocation}
        gestureHandling={"greedy"}
        disableDefaultUI
      >
        <Marker position={markerLocation} />
      </Map>
    </Box>
  );
}

export default CustomMap