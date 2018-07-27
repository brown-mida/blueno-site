import React, { Component } from 'react';

import NavbarMain from '../components/NavbarMain';
import Annotator from '../annotator/Annotator';

class App extends Component {
  render() {
    return (
        <div className="App">
          <NavbarMain/>
          <Annotator/>
        </div>
    );
  }
}

export default App;
