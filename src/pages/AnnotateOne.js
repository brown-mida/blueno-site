import React, { Component } from 'react';

import { BASE_URI, get } from '../utils/Backend';

import AnnotateTab from '../components/AnnotateTab';
import VisTab from '../components/VisTab';
import CreateTab from '../components/AnnotateCreateTab';
import LogTab from '../components/LogTab';
import NavbarDataset from '../components/NavbarDataset';

import '../assets/Preprocess.css';
import '../assets/Annotator.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datasetFiles: [],
      fileImages: [],
      currentTab: 'annotate',
      visMode: 'axial',
      currentDataset: 'default',
      imageMode: '3D',
      currentAnnotation: {name: null},
      annotations: {},
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="upload-container">
        <NavbarDataset user={this.props.match.params.user}/>
        <div className="card preprocess-options">
          <div className="card-body">
            <h5 className="card-title">Annotating {this.props.match.params.id}</h5>
          </div>
        </div>
        <div className="visual-container">
          Lmao
        </div>
      </div>
    );
  }
}

export default App;
