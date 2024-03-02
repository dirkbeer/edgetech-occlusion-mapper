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
  const [pan, setPan] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [zoom, setZoom] = useState(2000);


  useEffect( () => {
    try {
      //fetch(`http://localhost:5000/camera?pan=${pan}&tile=${tilt}&zoom=${zoom}`).then(response => response.json()).then(data => console.log(data));
  } catch (err) {
      console.log(err.message)
  }
  }, [pan, tilt, zoom]);

  const handlePanChange=  (amount) => {
    var new_pan = pan + amount;
    setPan(new_pan);
}

const handleTiltChange=  (amount) => {
  var new_tilt = tilt + amount;
  setTilt(new_tilt);
}

const handleZoomChange=  (amount) => {
  var new_zoom = zoom + amount;
  setZoom(new_zoom);
}

    return (
      <div >
        <table>
          <tr>
            <td className="App"> <BasicStream  /></td>
            <td> 
              <div>   
            <button onClick={()=>{handlePanChange(-10)}}>Decrease Pan</button>       
              {pan}
              <button  onClick={()=>{handlePanChange(10)}}>Increase Pan</button> </div>  

              <div>
              <button onClick={()=>{handleTiltChange(-10)}}>Decrease Pan</button>       
              {tilt}
              <button  onClick={()=>{handleTiltChange(10)}}>Increase Pan</button></div>
              <div>
              <button onClick={()=>{handleZoomChange(-200)}}>Decrease Pan</button>       
              {zoom}
              <button  onClick={()=>{handleZoomChange(200)}}>Increase Pan</button></div>
              </td>
          </tr>
        </table>


      </div>
    );
  }

  export default App;
  
