import React, { Component } from 'react';

import { post } from '../utils/Backend';

import '../assets/Preprocess.css';
import '../assets/CreateTab.css';

class CreateTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'My New Annotation',
      type: 'label'
    };
    this.handleChangeByValue = this.handleChangeByValue.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.createAnnotationGroup = this.createAnnotationGroup.bind(this);
  }

  handleChangeByValue(name, val) {
    return () => {
      this.setState({ [name]: val });
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

  createAnnotationGroup() {
    // Check for valid input

    const params = {user: this.props.user, name: this.state.name, type: this.state.type}
    console.log(params);
    post('annotator/create-annotation-group', params).then((res) => {
      console.log(res);
      alert('Annotation has been created.');
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
            name="type"
            className="form-check-input"
            type="radio"
            value="label"
            checked={this.state.type === 'label'}
            onChange={this.handleInputChange} />
          <label className="form-check-label" onClick={this.handleChangeByValue('type', 'label')}>
            Label
          </label>
        </div>
        <div className="input-item">
          <input
            name="type"
            className="form-check-input"
            type="radio"
            value="bbox"
            checked={this.state.type === 'bbox'}
            onChange={this.handleInputChange} />
          <label className="form-check-label" onClick={this.handleChangeByValue('type', 'bbox')}>
            Bounding Box
          </label>
        </div>
        <button type="button" className="btn btn-success" onClick={this.createAnnotationGroup}>
          Create preprocessing job
        </button>
      </div>
    );
  }
}

export default CreateTab;
