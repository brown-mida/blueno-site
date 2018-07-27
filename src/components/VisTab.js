import React, { Component } from 'react';

import { get } from '../utils/Backend';

import '../assets/Preprocess.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visMode: 'axial',
      currentDataset: 'default',
      datasets: [],
    }

    this.handleClickVisMode = this.handleClickVisMode.bind(this);
    this.handleClickDataset = this.handleClickDataset.bind(this);
  }

  componentDidMount() {
    get(`get-datasets-from-user?user=${this.props.user}`).then((res) => {
      this.setState({
        datasets: res.data,
      });
    });
  }

  handleClickVisMode(mode) {
    return () => {
      if (this.state.visMode !== mode) {
        this.props.updateViewerStateMode(mode);
        this.setState({
          visMode: mode,
        });
      }
    }
  }

  handleClickDataset(dataset) {
    return () => {
      if (this.state.currentDataset !== dataset) {
        // Update dataset
        this.props.updateViewerStateDataset(dataset);
        this.setState({
          currentDataset: dataset,
        });
      }
    }
  }

  render() {
    return (
      <div>
        Visualization Mode
        <div className="dropdown">
          <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {this.props.imageMode === '3D' ? this.state.visMode : 'MIP'}
          </button>
          {this.props.imageMode === '3D' ?
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <span className="dropdown-item" onClick={this.handleClickVisMode('axial')}>Axial</span>
              <span className="dropdown-item" onClick={this.handleClickVisMode('coronal')}>Coronal</span>
              <span className="dropdown-item" onClick={this.handleClickVisMode('sagittal')}>Sagittal</span>
            </div> :
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <span className="dropdown-item" onClick={this.handleClickVisMode('mip')}>MIP</span>
            </div>
          }
        </div>
        Current Dataset
        <div className="dropdown">
          <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {this.state.currentDataset}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {
              this.state.datasets.map((each) => {
                return <span key={each} className="dropdown-item" onClick={this.handleClickDataset(each)}>{each}</span>
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
