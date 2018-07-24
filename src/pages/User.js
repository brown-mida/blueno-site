import React, { Component } from 'react';
import DropZone from 'react-dropzone';

import { post, postFileData } from '../utils/Backend';

import NavbarDataset from '../components/NavbarDataset';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileSent: {}
    }
  }

  render() {
    return (
      <div className="App">
        <NavbarDataset user={this.props.match.params.user}/>
        <div className="header-name">
          Dataset {this.props.match.params.user}
        </div>
        This is the dataset page.
      </div>
    );
  }
}

export default App;
