import React, { Component } from 'react';

import NavbarMain from '../components/NavbarMain';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarMain />
        <p>
          <h5>
            Welcome! The new elvo site is under renovation but all of the
            original features are still available.
          </h5>
          <p>Annotating ELVOs (if you have access to the ID spreadsheet)</p>
          <p>Training customized models on the ELVO dataset</p>
          <p>
            Preprocessing pipeline (Uploading Data, applying preprocessing)
            (through the sign-in menu)
          </p>
        </p>
      </div>
    );
  }
}

export default App;
