import React, { Component } from 'react';

import { get } from '../utils/Backend';

import '../assets/Preprocess.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datasets: [],
      datasetLoaded: false,
    };

    this.handleClickVisMode = this.handleClickVisMode.bind(this);
    this.handleClickDataset = this.handleClickDataset.bind(this);
  }

  componentDidMount() {
    get(`get-datasets-from-user?user=${this.props.user}`).then(res => {
      this.setState({
        datasets: res.data,
        datasetLoaded: true,
      });
    });
  }

  handleClickVisMode(mode) {
    return () => {
      if (this.props.visMode !== mode) {
        this.props.updateViewerStateMode(mode);
      }
    };
  }

  handleClickDataset(dataset) {
    return () => {
      if (this.props.currentDataset !== dataset) {
        // Update dataset
        this.props.updateViewerStateDataset(dataset);
      }
    };
  }

  renderVisTab() {
    return (
      <div>
        Visualization Mode
        <div className="dropdown">
          <button
            className="btn btn-secondary btn-sm dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.props.imageMode === '3D' ? this.props.visMode : 'MIP'}
          </button>
          {this.props.imageMode === '3D' ? (
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <span
                className="dropdown-item"
                onClick={this.handleClickVisMode('axial')}
              >
                Axial
              </span>
              <span
                className="dropdown-item"
                onClick={this.handleClickVisMode('coronal')}
              >
                Coronal
              </span>
              <span
                className="dropdown-item"
                onClick={this.handleClickVisMode('sagittal')}
              >
                Sagittal
              </span>
            </div>
          ) : (
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <span
                className="dropdown-item"
                onClick={this.handleClickVisMode('mip')}
              >
                MIP
              </span>
            </div>
          )}
        </div>
        Current Dataset
        <div className="dropdown">
          <button
            className="btn btn-secondary btn-sm dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {this.props.currentDataset}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {this.state.datasets.map(each => {
              return (
                <span
                  key={each}
                  className="dropdown-item"
                  onClick={this.handleClickDataset(each)}
                >
                  {each}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  renderNoDataset() {
    return (
      <div>
        Visualization Mode
        <br />
        There are no datasets available.
      </div>
    );
  }

  renderLoading() {
    return (
      <div>
        Visualization Mode
        <br />
        Loading...
      </div>
    );
  }

  render() {
    if (!this.state.datasetLoaded) {
      return this.renderLoading();
    } else if (this.state.datasets.length === 0) {
      return this.renderNoDataset();
    } else {
      return this.renderVisTab();
    }
  }
}

export default App;
