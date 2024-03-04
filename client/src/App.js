import logo from './logo.svg';
import './App.css';
import { BasicStream } from './BasicStream'
import React, { useCallback, useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    if (new_azimuth > 180) {
      new_azimuth =  (new_azimuth %180) - 180;
    }
    if (new_azimuth < -179) {
      new_azimuth = 360+new_azimuth;
    }
/*
    if (new_azimuth > 360) {
      new_azimuth = new_azimuth % 360;
    }
    if (new_azimuth < 0) {
      new_azimuth = 360 + new_azimuth;
    }*/
    setAzimuth(new_azimuth);
  }

  const handleElevationChange = (amount) => {

    var new_elevation = elevation + amount;
    if (new_elevation > 90) {
      new_elevation = 90;
    }
    if (new_elevation < 0) {
      new_elevation = 0;
    }
    setElevation(new_elevation);
  }

  const handleZoomChange = (amount) => {
    var new_zoom = zoom + amount;
    if (new_zoom > 9999) {
      new_zoom = 9999;
    }
    if (new_zoom < 1) {
      new_zoom = 1;
    }
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

  const saveMapping = () => {
    fetch('http://localhost:5000/save-mapping', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mapping),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  return (
    <div >
      <table>
        <tr>
          <td className="App"> <BasicStream /></td>
          <td>
            <table>
              <tbody>
                <tr>
                  <td/>
                  <td/>
                  <td/>
                  <td><button onClick={() => { handleElevationChange(10) }}>10</button></td>
                  <td/>
                  <td/>
                  <td/>
                  </tr>
                  <tr>
                  <td/>
                  <td/>
                  <td/>
                  <td><button onClick={() => { handleElevationChange(5) }}>5</button></td>
                  <td/>
                  <td/>
                  <td/>
                  </tr>
                  <tr>
                  <td/>
                  <td/>
                  <td/>
                  <td><button onClick={() => { handleElevationChange(1) }}>1</button></td>
                  <td/>
                  <td/>
                  <td/>
                  </tr>
                  <tr>
                  <td><button onClick={() => { handleAzimuthChange(-10) }}>-10</button></td>
                  <td><button onClick={() => { handleAzimuthChange(-5) }}>-5</button></td>
                  <td><button onClick={() => { handleAzimuthChange(-1) }}>-1</button></td>
                  <td>{azimuth} / {elevation}</td>
                  <td><button onClick={() => { handleAzimuthChange(1) }}>1</button></td>
                  <td><button onClick={() => { handleAzimuthChange(5) }}>5</button></td>
                  <td><button onClick={() => { handleAzimuthChange(10) }}>10</button></td>
                  </tr>
                  <tr>
                  <td/>
                  <td/>
                  <td/>
                  <td><button onClick={() => { handleElevationChange(-1) }}>-1</button></td>
                  <td/>
                  <td/>
                  <td/>
                  </tr>
                  <tr>
                  <td/>
                  <td/>
                  <td/>
                  <td><button onClick={() => { handleElevationChange(-5) }}>-5</button></td>
                  <td/>
                  <td/>
                  <td/>
                  </tr>
                  <tr>
                  <td/>
                  <td/>
                  <td/>
                  <td><button onClick={() => { handleElevationChange(-10) }}>-10</button></td>
                  <td/>
                  <td/>
                  <td/>
                  </tr>
              </tbody>
            </table>

            <div>
              <h3>Zoom</h3>
              <button onClick={() => { handleZoomChange(-1000) }}>-1000</button>
              <button onClick={() => { handleZoomChange(-200) }}>-200</button>
              {zoom}
              <button onClick={() => { handleZoomChange(200) }}>200</button>
              <button onClick={() => { handleZoomChange(200) }}>1000</button></div>
              <div>
                <h3>Mapping</h3>
              <button onClick={upsertMapping}>Add Point</button>
              <button onClick={saveMapping}>Save Mapping</button>
              </div>
          </td>
        </tr>
      </table>
      <div >
      <ResponsiveContainer width="95%" height={400}>
    <LineChart
      height={300}
      data={mapping}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="azimuth" domain={[-179, 180]} />
      <YAxis dataKey="elevation" domain={[0, 90]} /> // Set the Y-axis domain to [0, 90]
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="elevation" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
    </ResponsiveContainer>
  </div>

    </div>
  );
}

export default App;

