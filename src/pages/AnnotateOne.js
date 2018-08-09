import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { get, post } from '../utils/Backend';

import NavbarDataset from '../components/NavbarDataset';
import PlaneSVG from '../components/PlaneSVG';

import '../assets/Annotator.css';
import '../assets/CreateTab.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      x1: 0,
      x2: 0,
      y1: 0,
      y2: 0,
      z1: 0,
      z2: 0,
      x: 100,
      y: 100,
      z: 100,
      class: '',
      annotationType: 'loading',
      scrollAmount: 2,
      shapeX: 0,
      shapeY: 0,
      shapeZ: 0,
      viewTab: 'axial',
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateIndexScroll = this.updateIndexScroll.bind(this);
    this.handleClickViewTab = this.handleClickViewTab.bind(this);
    this.makeAnnotation = this.makeAnnotation.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleClickViewTab(value) {
    return () => {
      this.setState({ viewTab: value });
    }
  }

  updateIndexScroll(attr) {
    return (event) => {
      let newValue;
      if (event.deltaY > 0) {
        newValue = this.state[attr] - this.state.scrollAmount;
      } else {
        newValue = this.state[attr] + this.state.scrollAmount;
        if (newValue < 0) {
          newValue = 0;
        }
      }
      this.setState((state) => {
        state[attr] = newValue;
        return state;
      });
    }
  }

  makeAnnotation() {
    if (this.state.annotationType === 'label' && this.state.class === "") {
      alert("Error: Do not leave fields empty.");
      return;
    }

    if (isNaN(this.state.x1) || isNaN(this.state.x2) || isNaN(this.state.y1) ||
        isNaN(this.state.y2) || isNaN(this.state.z1) || isNaN(this.state.z1)) {
      alert("Error: Field must be integer.");
      return;
    }

    const params = {
      user: this.props.match.params.user,
      group: this.props.match.params.group,
      id: this.props.match.params.id,
      type: this.state.annotationType,
    }

    if (this.state.annotationType === 'label') {
      params.data = {
        'class': this.state.class
      };
    } else if (this.state.annotationType === 'bbox') {
      params.data = {
        'x1': this.state.x1,
        'x2': this.state.x2,
        'y1': this.state.y1,
        'y2': this.state.y2,
        'z1': this.state.z1,
        'z2': this.state.z2,
      };
    }

    post('annotator/annotate', params).then((res) => {
      if (res.status === 'success') {
        alert('Annotation has been created.');
      } else {
        alert(`Error: ${res.error}`);
      }
    });
  }

  componentDidMount() {
    get(`annotator/get-annotation-type?user=${this.props.match.params.user}&group=${this.props.match.params.group}`).then((res) => {
      this.setState({
        annotationType: res.data.type,
      });
    });

    get (`annotator/get-image-dimensions?user=${this.props.match.params.user}&id=${this.props.match.params.id}`).then((res) => {
      this.setState({
        shapeX: res.data.x,
        shapeY: res.data.y,
        shapeZ: res.data.z
      });
    });
  }

  renderClassEntry() {
    return (
      <div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">class</span>
          </div>
          <input
            type="text"
            className="form-control"
            name="class"
            value={this.state.class}
            onChange={this.handleInputChange}/>
        </div>
      </div>
    );
  }

  renderBboxEntry() {
    return (
      <div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">x1</span>
          </div>
          <input
            type="number"
            className="form-control"
            name="x1"
            value={this.state.x1}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">x2</span>
          </div>
          <input
            type="number"
            className="form-control"
            name="x2"
            value={this.state.x2}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">y1</span>
          </div>
          <input
            type="number"
            className="form-control"
            name="y1"
            value={this.state.y1}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">y2</span>
          </div>
          <input
            type="number"
            className="form-control"
            name="y2"
            value={this.state.y2}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">z1</span>
          </div>
          <input
            type="number"
            className="form-control"
            name="z1"
            value={this.state.z1}
            onChange={this.handleInputChange}/>
        </div>
        <div className="input-group input-group-sm mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-sm">z2</span>
          </div>
          <input
            type="number"
            className="form-control"
            name="z2"
            value={this.state.z2}
            onChange={this.handleInputChange}/>
        </div>
      </div>
    );
  }

  renderSingleView() {
    return (
      <div className="annotation-container">
        <div className="card body">
          {this.state.viewTab === 'axial' &&
            <PlaneSVG
              viewType='axial'
              patientId={this.props.match.params.id}
              user={this.props.match.params.user}
              posIndex={this.state.z}
              scrollEvent={this.updateIndexScroll('z')}
              width={this.state.shapeX}
              height={this.state.shapeY}
              colorX={'rgb(255, 0, 0)'}
              colorY={'rgb(0, 255, 0)'}
              roiX1={this.state.x1}
              roiX2={this.state.x2}
              roiY1={this.state.y1}
              roiY2={this.state.y2}
              annotationType={this.state.annotationType}
            />
          }
          {this.state.viewTab === 'axial_mip' &&
            <PlaneSVG
              viewType='axial_mip'
              patientId={this.props.match.params.id}
              user={this.props.match.params.user}
              posIndex={this.state.z}
              scrollEvent={this.updateIndexScroll('z')}
              width={this.state.shapeX}
              height={this.state.shapeY}
              colorX={'rgb(255, 0, 0)'}
              colorY={'rgb(0, 255, 0)'}
              roiX1={this.state.x1}
              roiX2={this.state.x2}
              roiY1={this.state.y1}
              roiY2={this.state.y2}
              annotationType={this.state.annotationType}
            />
          }
          {this.state.viewTab === 'coronal' &&
            <PlaneSVG
              viewType='coronal'
              patientId={this.props.match.params.id}
              user={this.props.match.params.user}
              posIndex={this.state.y}
              scrollEvent={this.updateIndexScroll('y')}
              width={this.state.shapeX}
              height={this.state.shapeZ}
              colorX={'rgb(255, 0, 0)'}
              colorY={'rgb(0, 0, 255)'}
              roiX1={this.state.x1}
              roiX2={this.state.x2}
              roiY1={this.state.z1}
              roiY2={this.state.z2}
              annotationType={this.state.annotationType}
            />
          }
          {this.state.viewTab === 'sagittal' &&
            <PlaneSVG
              viewType='sagittal'
              patientId={this.props.match.params.id}
              user={this.props.match.params.user}
              posIndex={this.state.x}
              scrollEvent={this.updateIndexScroll('x')}
              width={this.state.shapeY}
              height={this.state.shapeZ}
              colorX={'rgb(0, 255, 0)'}
              colorY={'rgb(0, 0, 255)'}
              roiX1={this.state.y1}
              roiX2={this.state.y2}
              roiY1={this.state.z1}
              roiY2={this.state.z2}
              annotationType={this.state.annotationType}
            />
          }
        </div>
      </div>
    );
  }

  renderMultiView() {
    return (
      <div className="annotation-container-multi">
        <div className="card body">
          <h5 className="card-title">Axial</h5>
          <PlaneSVG
            viewType='axial'
            patientId={this.props.match.params.id}
            user={this.props.match.params.user}
            posIndex={this.state.z}
            scrollEvent={this.updateIndexScroll('z')}
            width={this.state.shapeX}
            height={this.state.shapeY}
            colorX={'rgb(255, 0, 0)'}
            colorY={'rgb(0, 255, 0)'}
            roiX1={this.state.x1}
            roiX2={this.state.x2}
            roiY1={this.state.y1}
            roiY2={this.state.y2}
            annotationType={this.state.annotationType}
          />
        </div>
        <div className="card body">
          <h5 className="card-title">Axial MIP</h5>
          <PlaneSVG
            viewType='axial_mip'
            patientId={this.props.match.params.id}
            user={this.props.match.params.user}
            posIndex={this.state.z}
            scrollEvent={this.updateIndexScroll('z')}
            width={this.state.shapeX}
            height={this.state.shapeY}
            colorX={'rgb(255, 0, 0)'}
            colorY={'rgb(0, 255, 0)'}
            roiX1={this.state.x1}
            roiX2={this.state.x2}
            roiY1={this.state.y1}
            roiY2={this.state.y2}
            annotationType={this.state.annotationType}
          />
        </div>
        <div className="card body">
          <h5 className="card-title">Coronal</h5>
          <PlaneSVG
            viewType='coronal'
            patientId={this.props.match.params.id}
            user={this.props.match.params.user}
            posIndex={this.state.y}
            scrollEvent={this.updateIndexScroll('y')}
            width={this.state.shapeX}
            height={this.state.shapeZ}
            colorX={'rgb(255, 0, 0)'}
            colorY={'rgb(0, 0, 255)'}
            roiX1={this.state.x1}
            roiX2={this.state.x2}
            roiY1={this.state.z1}
            roiY2={this.state.z2}
            annotationType={this.state.annotationType}
          />
        </div>
        <div className="card body">
          <h5 className="card-title">Sagittal</h5>
          <PlaneSVG
            viewType='sagittal'
            patientId={this.props.match.params.id}
            user={this.props.match.params.user}
            posIndex={this.state.x}
            scrollEvent={this.updateIndexScroll('x')}
            width={this.state.shapeY}
            height={this.state.shapeZ}
            colorX={'rgb(0, 255, 0)'}
            colorY={'rgb(0, 0, 255)'}
            roiX1={this.state.y1}
            roiX2={this.state.y2}
            roiY1={this.state.z1}
            roiY2={this.state.z2}
            annotationType={this.state.annotationType}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="upload-container">
        <NavbarDataset user={this.props.match.params.user}/>
        <div className="card preprocess-options">
          <div className="card-body">
            <div className="card-head">
                <Link to={`/u/${this.props.match.params.user}/annotate/${this.props.match.params.group}`} >
                  <button type="button" className="btn btn-dark btn-sm" >
                    Back to annotation list
                  </button>
                </Link>
            </div>
            <h5 className="card-title">Annotating {this.props.match.params.id}</h5>
            <div className="input-group input-group-sm mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">x</span>
              </div>
              <input
                type="number"
                className="form-control"
                name="x"
                value={this.state.x}
                onChange={this.handleInputChange}/>
            </div>
            <div className="input-group input-group-sm mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">y</span>
              </div>
              <input
                type="number"
                className="form-control"
                name="y"
                value={this.state.y}
                onChange={this.handleInputChange}/>
            </div>
            <div className="input-group input-group-sm mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="inputGroup-sizing-sm">z</span>
              </div>
              <input
                type="number"
                className="form-control"
                name="z"
                value={this.state.z}
                onChange={this.handleInputChange}/>
            </div>
            <h5 className="card-title">Label</h5>
            {this.state.annotationType === 'label' &&
              this.renderClassEntry()
            }
            {this.state.annotationType === 'bbox' &&
              this.renderBboxEntry()
            }
            <button type="button" className="btn btn-success" onClick={this.makeAnnotation} >
              Make annotation
            </button>
          </div>
        </div>
        <div className="vis-container">
          <div className="vis-tab">
            <ul className="nav nav-tabs dataset-tabs">
              <li className="nav-item" onClick={this.handleClickViewTab('axial')}>
                <button type="button" className={`btn btn-light ${this.state.viewTab === 'axial' && 'active'}`}>Axial</button>
              </li>
              <li className="nav-item" onClick={this.handleClickViewTab('axial_mip')}>
                <button type="button" className={`btn btn-light${this.state.viewTab === 'axial_mip' && 'active'}`}>Axial MIP</button>
              </li>
              <li className="nav-item" onClick={this.handleClickViewTab('coronal')}>
                <button type="button" className={`btn btn-light ${this.state.viewTab === 'coronal' && 'active'}`}>Coronal</button>
              </li>
              <li className="nav-item" onClick={this.handleClickViewTab('sagittal')}>
                <button type="button" className={`btn btn-light ${this.state.viewTab === 'sagittal' && 'active'}`}>Sagittal</button>
              </li>
              <li className="nav-item" onClick={this.handleClickViewTab('multi')}>
                <button type="button" className={`btn btn-light${this.state.viewTab === 'multi' && 'active'}`}>Multi</button>
              </li>
            </ul>
          </div>
          {this.state.viewTab === 'multi' ?
            this.renderMultiView() :
            this.renderSingleView()
          }
        </div>
      </div>
    );
  }
}

export default App;
