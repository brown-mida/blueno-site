import React from "react";
import { render } from "react-dom";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";

import CornerstoneElement from '../components/CornerstoneVisualizer';

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      roiX1: 100,
      roiX2: 200,
      roiY1: 100,
      roiY2: 200,
      roiZ1: 100,
      roiZ2: 200
    };

    this.updateCoords = this.updateCoords.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  updateCoords(x1, x2, y1, y2, label_x1, label_x2, label_y1, label_y2) {
    this.setState((state) => {
      state[label_x1] = x1;
      state[label_x2] = x2;
      state[label_y1] = y1;
      state[label_y2] = y2;
      return state;
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-4">
            <CornerstoneElement
              url="/annotator/get-image-slice?user=abc&id=0DQO9A6UXUQHR8RA.cab&type=axial"
              x1={this.state.roiX1}
              x2={this.state.roiX2}
              y1={this.state.roiY1}
              y2={this.state.roiY2}
              label_x1='roiX1'
              label_x2='roiX2'
              label_y1='roiY1'
              label_y2='roiY2'
              updateCoords={this.updateCoords}
            />
          </div>
          <div className="col-4">
            <CornerstoneElement
              url="/annotator/get-image-slice?user=abc&id=0DQO9A6UXUQHR8RA.cab&type=coronal"
              x1={this.state.roiX1}
              x2={this.state.roiX2}
              y1={this.state.roiZ1}
              y2={this.state.roiZ2}
              label_x1='roiX1'
              label_x2='roiX2'
              label_y1='roiZ1'
              label_y2='roiZ2'
              updateCoords={this.updateCoords}
            />
          </div>
          <div className="col-4">
            <CornerstoneElement
              url="/annotator/get-image-slice?user=abc&id=0DQO9A6UXUQHR8RA.cab&type=sagittal"
              x1={this.state.roiY1}
              x2={this.state.roiY2}
              y1={this.state.roiZ1}
              y2={this.state.roiZ2}
              label_x1='roiY1'
              label_x2='roiY2'
              label_y1='roiZ1'
              label_y2='roiZ2'
              updateCoords={this.updateCoords}
            />
          </div>
        </div>
        <label>X1</label>
        <input name="roiX1" type="number" value={this.state.roiX1} onChange={this.handleInputChange}/>
        <label>X2</label>
        <input name="roiX2" type="number" value={this.state.roiX2} onChange={this.handleInputChange}/>
        <br />
        <label>Y1</label>
        <input name="roiY1" type="number" value={this.state.roiY1} onChange={this.handleInputChange}/>
        <label>Y2</label>
        <input name="roiY2" type="number" value={this.state.roiY2} onChange={this.handleInputChange}/>
        <br />
        <label>Z1</label>
        <input name="roiZ1" type="number" value={this.state.roiZ1} onChange={this.handleInputChange}/>
        <label>Z2</label>
        <input name="roiZ2" type="number" value={this.state.roiZ2} onChange={this.handleInputChange}/>
        <p>
          Instructions: Left click and drag for WW/WC. Right click for zoom.
          Middle click for pan. Scroll to go through the layers.
        </p>
        <p>
          Each image has a bounding box. Click and drag the circular corners to resize them.
          Click and drag the edges to move the box.
        </p>
        <p>
          Alternatively you can directly edit the input values to change the bounding boxes.
        </p>
        <p>
          This is extremely buggy. Let me know if there are any issues.
        </p>
      </div>
    );
  }
}

export default App;
