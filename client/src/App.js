import logo from './logo.svg';
import './App.css';
import { BasicStream } from './BasicStream'
import React, { useCallback, useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
window.addEventListener('error', e => {
  if (e.message === 'ResizeObserver loop limit exceeded' || e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    const resizeObserverErrDiv = document.getElementById(
      'webpack-dev-server-client-overlay-div'
    );
    const resizeObserverErr = document.getElementById(
      'webpack-dev-server-client-overlay'
    );
    if (resizeObserverErr) {
      resizeObserverErr.setAttribute('style', 'display: none');
    }
    if (resizeObserverErrDiv) {
      resizeObserverErrDiv.setAttribute('style', 'display: none');
    }
  }
});

function App() {
  const [mapping, setMapping] = useState([]);
  const [azimuth, setAzimuth] = useState(0);
  const [elevation, setElevation] = useState(0);
  const [zoom, setZoom] = useState(2000);


  useEffect(() => {
    try {

      fetch(`http://localhost:5000/camera-point?azimuth=${azimuth}&elevation=${elevation}&zoom=${zoom}`).then(response => response.json()).then(data => console.log(data));
    } catch (err) {
      console.log(err.message)
    }
  }, [azimuth, elevation, zoom]);

  const handleAzimuthChange = (amount) => {
    var new_azimuth = azimuth + amount;
    setAzimuth(new_azimuth);
  }

  const handleElevationChange = (amount) => {
    var new_elevation = elevation + amount;
    setElevation(new_elevation);
  }

  const handleZoomChange = (amount) => {
    var new_zoom = zoom + amount;
    setZoom(new_zoom);
  }


  const upsertMapping = () => {
    var index = mapping.findIndex(item => item.azimuth === azimuth);

    // If we have a value at the current Azimuth, update it
    if (index >= 0) {
      const updated_mapping = mapping.map((c, i) => {
        if (i === index) {
          // Update the azimuth value that changed
          return {azimuth, elevation};
        } else {
          // The rest haven't changed
          return c;
        }
      });
      setMapping(updated_mapping);
    } else {
      // If we don't have a value at the current Azimuth, add it
      const updated_mapping = [ // with a new array
        ...mapping, // that contains all the old items
        { azimuth, elevation } // and one new item at the end
      ]

      const sorted_mapping = updated_mapping.sort(function (a, b) {
        // Sort the array by azimuth
        if (a.azimuth > b.azimuth) { return 1; }
        if (a.azimuth < b.azimuth) { return -1; }
        return 0;
      });
      setMapping(sorted_mapping);
    }
    console.log(mapping);
  }
  return (
    <div >
      <table>
        <tr>
          <td className="App"> <BasicStream /></td>
          <td>
            <div>
              <button onClick={() => { handleAzimuthChange(-10) }}>Decrease Azimuth</button>
              {azimuth}
              <button onClick={() => { handleAzimuthChange(10) }}>Increase Azimuth</button> </div>

            <div>
              <button onClick={() => { handleElevationChange(-10) }}>Decrease Elevation</button>
              {elevation}
              <button onClick={() => { handleElevationChange(10) }}>Increase Elevation</button></div>
            <div>
              <button onClick={() => { handleZoomChange(-200) }}>Decrease Zoom</button>
              {zoom}
              <button onClick={() => { handleZoomChange(200) }}>Increase Zoom</button></div>
              <button onClick={upsertMapping}>Add Point</button>
          </td>
        </tr>
      </table>


    </div>
  );
}

export default App;

