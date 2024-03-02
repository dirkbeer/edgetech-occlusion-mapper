import logo from './logo.svg';
import './App.css';
import { BasicStream } from './BasicStream'
import React, { useCallback, useState } from 'react'
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

  const [pan, setPan] = useState(0);


  const handlePanChange= async (amount) => {
    var new_pan = pan + amount;
    setPan(new_pan);
    try {
        const data = await (await fetch(`http://localhost:3000/camera?pan=${new_pan}`)).json()
    } catch (err) {
        console.log(err.message)
    }
}

    return (
      <div >
        <table>
          <tr>
            <td className="App"> <BasicStream  /></td>
            <td>      
            <button onClick={()=>{handlePanChange(-10)}}>Decrease Pan</button>       
           
              {pan}
              <button  onClick={()=>{handlePanChange(10)}}>Increase Pan</button>
              </td>
          </tr>
        </table>


      </div>
    );
  }

  export default App;
  
