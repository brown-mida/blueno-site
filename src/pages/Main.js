import React, { Component } from 'react';

import NavbarMain from '../components/NavbarMain';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarMain />
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
