import React, { Component } from 'react';
import DropZone from 'react-dropzone';

import { post, postFileData } from '../utils/Backend';

import logo from '../logo.svg';
import '../App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileSent: {}
    }

    this.handleUploadDataset = this.handleUploadDataset.bind(this);
  }

  handleUploadDataset(files) {
    console.log(files);
    postFileData('upload-dataset', files, {user: this.props.match.params.user}).then((res) => {
      console.log(res);
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          User page. {this.props.match.params.user}
        </p>
        <DropZone onDrop={this.handleUploadDataset}>
          <div>
            Click to upload a file (or drag a file.) File mut be a zip with folders of .dcm files.
          </div>
        </DropZone>
      </div>
    );
  }
}

export default App;
