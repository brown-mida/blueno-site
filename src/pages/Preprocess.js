import React, { Component } from 'react';

import { get } from '../utils/Backend';

import VisTab from '../components/VisTab';
import CreateTab from '../components/CreateTab';
import LogTab from '../components/LogTab';
import NavbarDataset from '../components/NavbarDataset';

import '../assets/Preprocess.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datasetFiles: [],
      fileImages: [],
      currentTab: 'vis',
      visMode: 'axial',
      currentDataset: 'default',
      imageMode: '3D',
    };

    this.handleClickTab = this.handleClickTab.bind(this);
    this.updateViewerStateMode = this.updateViewerStateMode.bind(this);
    this.updateViewerStateDataset = this.updateViewerStateDataset.bind(this);
  }

  handleClickTab(tab) {
    return () => {
      this.setState({
        currentTab: tab,
      });
    };
  }

  componentDidMount() {
    get(
      `get-dataset?user=${this.props.match.params.user}&dataset=${
        this.state.currentDataset
      }`
    ).then(res => {
      const files = [];
      res.data.forEach(each => {
        if (each.status === 'loaded') {
          files.push(each);
        }
      });

      const fileImages = [];
      files.forEach(each => {
        fileImages.push({
          name: each.name,
          shape: each.shape,
          url:
            `/get-dataset-image?user=${this.props.match.params.user}` +
            `&dataset=default&type=${this.state.visMode}&name=${each.name}`,
        });
      });
      this.setState({
        fileImages,
        datasetFiles: files,
      });
    });
  }

  updateViewerStateMode(visMode) {
    const fileImages = [];
    this.state.datasetFiles.forEach(each => {
      fileImages.push({
        name: each.name,
        shape: each.shape,
        url:
          `/get-dataset-image?user=${this.props.match.params.user}` +
          `&dataset=${this.state.currentDataset}&type=${visMode}&name=${
            each.name
          }`,
      });
    });

    this.setState({
      fileImages,
      visMode,
    });
  }

  updateViewerStateDataset(currentDataset) {
    if (this.state.currentDataset !== currentDataset) {
      get(
        `get-dataset?user=${
          this.props.match.params.user
        }&dataset=${currentDataset}`
      ).then(res => {
        const files = [];
        res.data.forEach(each => {
          if (each.status === 'loaded') {
            files.push(each);
          }
        });

        const mipped = files[0].mip;
        const fileImages = [];
        files.forEach(each => {
          fileImages.push({
            name: each.name,
            shape: each.shape,
            url:
              `/get-dataset-image?user=${this.props.match.params.user}` +
              `&dataset=${currentDataset}&type=${
                mipped ? 'mip' : this.state.visMode
              }&name=${each.name}`,
          });
        });

        let imageMode;
        if (mipped) {
          imageMode = '2D';
        } else {
          imageMode = '3D';
        }
        this.setState({
          fileImages,
          datasetFiles: files,
          currentDataset,
          imageMode,
        });
      });
    }
  }

  render() {
    return (
      <div className="upload-container">
        <NavbarDataset user={this.props.match.params.user} />
        <div className="card preprocess-options">
          <div className="card-body">
            <h5 className="card-title">
              Preprocessing dataset {this.props.match.params.user}
            </h5>
            <ul className="nav nav-tabs dataset-tabs">
              <li className="nav-item" onClick={this.handleClickTab('vis')}>
                <button
                  type="button"
                  className={`btn btn-light ${this.state.currentTab === 'vis' &&
                    'active'}`}
                >
                  Vis
                </button>
              </li>
              <li className="nav-item" onClick={this.handleClickTab('create')}>
                <button
                  type="button"
                  className={`btn btn-light ${this.state.currentTab ===
                    'create' && 'active'}`}
                >
                  Create
                </button>
              </li>
              <li className="nav-item" onClick={this.handleClickTab('log')}>
                <button
                  type="button"
                  className={`btn btn-light ${this.state.currentTab === 'log' &&
                    'active'}`}
                >
                  Log
                </button>
              </li>
            </ul>
            {this.state.currentTab === 'vis' && (
              <VisTab
                user={this.props.match.params.user}
                updateViewerStateMode={this.updateViewerStateMode}
                updateViewerStateDataset={this.updateViewerStateDataset}
                imageMode={this.state.imageMode}
                visMode={this.state.visMode}
                currentDataset={this.state.currentDataset}
              />
            )}
            {this.state.currentTab === 'create' && (
              <CreateTab user={this.props.match.params.user} />
            )}
            {this.state.currentTab === 'log' && (
              <LogTab user={this.props.match.params.user} />
            )}
          </div>
        </div>
        <div className="visual-container">
          {this.state.fileImages.map(each => {
            return (
              <div key={each.url} className="image-card">
                <img
                  src={each.url}
                  style={{ width: '15vw', height: '15vw' }}
                  alt={each.name}
                />
                <p>{each.name}</p>
                <p>({each.shape.toString()})</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
