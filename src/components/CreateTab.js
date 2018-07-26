import React, { Component } from 'react';

import { get, post } from '../utils/Backend';

import '../assets/Preprocess.css';
import '../assets/CreateTab.css';

class CreateTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'My New Preprocessing',
      mip: false,
      multichannelMip: false,
      cropZ: false,
      cropZmin: '0',
      cropZmax: '100',
      centerCropXY: false,
      centerCropSize: '200',
      boundHu: false,
      boundHuMin: '-40',
      boundHuMax: '400'
    }
    this.handleChangeByValue = this.handleChangeByValue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.startPreprocessingJob = this.startPreprocessingJob.bind(this);
  }

  handleChangeByValue(name, val, dependency) {
    return () => {
      if (dependency) {
        this.setState({ [name]: val });
      }
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  startPreprocessingJob() {
    // Check for valid input
    if (this.state.cropZmin === "" || this.state.cropZmax === "" || this.state.centerCropSize === "" ||
        this.state.boundHuMin === "" || this.state.boundHuMax === "") {
      alert("Error: Do not leave fields empty.");
      return;
    }

    if (isNaN(this.state.cropZmin) || isNaN(this.state.cropZmax) || isNaN(this.state.centerCropSize) ||
        isNaN(this.state.boundHuMin) || isNaN(this.state.boundHuMax)) {
      alert("Error: Field must be integer.");
      return;
    }

    const params = {user: this.props.user}
    Object.keys(this.state).forEach((key) => {
      params[key] = this.state[key];
    })
    console.log(params);
    post('new-preprocessing-job', params).then((res) => {
      console.log(res);
      alert('Your job has been submitted. See its status at the logs tab.');
    })
  }


  render() {
    return (
      <div>
        <div className="input-item">
          <input
            type="text"
            className="form-control"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-item">
          <input
            name="mip"
            className="form-check-input"
            type="checkbox"
            checked={this.state.mip}
            onChange={this.handleInputChange} />
          <label className="form-check-label" onClick={this.handleChangeByValue('mip', !this.state.mip, true)}>
            Maximum Intensity Projection
          </label>
        </div>
        <div className="input-item">
          <input
            name="multichannelMip"
            className="form-check-input"
            type="checkbox"
            disabled={!this.state.mip}
            checked={this.state.multichannelMip}
            onChange={this.handleInputChange} />
          <label
            className="form-check-label"
            onClick={this.handleChangeByValue('multichannelMip', !this.state.multichannelMip, this.state.mip)}
          >
            Multichannel
          </label>
        </div>
        <div className="input-item">
          <input
            name="cropZ"
            className="form-check-input"
            type="checkbox"
            checked={this.state.cropZ}
            onChange={this.handleInputChange} />
          <label
            className="form-check-label"
            onClick={this.handleChangeByValue('cropZ', !this.state.cropZ, true)}
          >
            Crop Z axis
          </label>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">Min Z</span>
          </div>
          <input
            type="text"
            className="form-control"
            name="cropZmin"
            disabled={!this.state.cropZ}
            value={this.state.cropZmin}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">Max Z</span>
          </div>
          <input
            type="text"
            className="form-control"
            name="cropZmax"
            disabled={!this.state.cropZ}
            value={this.state.cropZmax}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-item">
          <input
            name="centerCropXY"
            className="form-check-input"
            type="checkbox"
            checked={this.state.centerCropXY}
            onChange={this.handleInputChange} />
          <label
            className="form-check-label"
            onClick={this.handleChangeByValue('centerCropXY', !this.state.centerCropXY, true)}
          >
            Center crop XY axis
          </label>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">Center crop size</span>
          </div>
          <input
            type="text"
            className="form-control"
            name="centerCropSize"
            disabled={!this.state.centerCropXY}
            value={this.state.centerCropSize}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-item">
          <input
            name="boundHu"
            className="form-check-input"
            type="checkbox"
            checked={this.state.boundHu}
            onChange={this.handleInputChange} />
          <label
            className="form-check-label"
            onClick={this.handleChangeByValue('boundHu', !this.state.boundHu, true)}
          >
            Bound Hounsfield Units
          </label>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">Min HU</span>
          </div>
          <input
            type="text"
            className="form-control"
            name="boundHuMin"
            disabled={!this.state.boundHu}
            value={this.state.boundHuMin}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">Max HU</span>
          </div>
          <input
            type="text"
            className="form-control"
            name="boundHuMax"
            disabled={!this.state.boundHu}
            value={this.state.boundHuMax}
            onChange={this.handleInputChange}/>
        </div>
        <button type="button" className="btn btn-success" onClick={this.startPreprocessingJob}>
          Create preprocessing job
        </button>
      </div>
    );
  }
}

export default CreateTab;
