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
        </p>
      </div>
    );
  }
}

export default App;
