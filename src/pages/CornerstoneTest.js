import React from "react";
import { render } from "react-dom";
import * as cornerstone from "cornerstone-core";
import * as cornerstoneMath from "cornerstone-math";
import * as cornerstoneTools from "cornerstone-tools";
import Hammer from "hammerjs";
import * as cornerstoneWebImageLoader from "cornerstone-web-image-loader";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;
cornerstoneTools.external.Hammer = Hammer;

const imageIds = [];
for (let i = 0; i < 200; i++) {
  imageIds.push(`http://localhost:3000/annotator/get-image-slice?user=abc&id=0DQO9A6UXUQHR8RA.cab&type=axial&slice=${i}`);
}

const measurementData = {
    visible: true,
    active: true,
    invalidated: true,
    handles: {
        start: {
            x: 100,
            y: 100,
            highlight: true,
            active: false
        },
        end: {
            x: 200,
            y: 200,
            highlight: true,
            active: true
        },
        textBox: {
            active: false,
            hasMoved: false,
            movesIndependently: false,
            drawnIndependently: true,
            allowedOutsideImage: true,
            hasBoundingBox: true
        }
    }
};

const divStyle = {
  width: "512px",
  height: "512px",
  position: "relative",
  color: "white"
};

const bottomLeftStyle = {
  bottom: "5px",
  left: "5px",
  position: "absolute",
  color: "white"
};

const bottomRightStyle = {
  bottom: "5px",
  right: "5px",
  position: "absolute",
  color: "white"
};

class CornerstoneElement extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      stack: props.stack,
      viewport: cornerstone.getDefaultViewport(null, undefined),
      imageId: props.stack.imageIds[0],
      roiX1: 100,
      roiX2: 200,
      roiY1: 100,
      roiY2: 200,
      roiZ1: 100,
      roiZ2: 200
    };

    this.onImageRendered = this.onImageRendered.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  render() {
    return (
      <div onContextMenu={() => {return false}}>
        <div
          className="viewportElement"
          style={divStyle}
          ref={input => {
            this.element = input;
          }}
        >
          <canvas className="cornerstone-canvas" />
          <div style={bottomLeftStyle}>Zoom: {this.state.viewport.scale}</div>
          <div style={bottomRightStyle}>
            WW/WC: {this.state.viewport.voi.windowWidth} /{" "}
            {this.state.viewport.voi.windowCenter}
          </div>
        </div>
        <label>X1</label>
        <input name="roiX1" value={this.state.roiX1}/>
        <label>X2</label>
        <input name="roiX2" value={this.state.roiX2}/>
        <br />
        <label>Y1</label>
        <input name="roiY1" value={this.state.roiY1}/>
        <label>Y2</label>
        <input name="roiY2" value={this.state.roiY2}/>
        <br />
        <label>Z1</label>
        <input name="roiZ1" value={this.state.roiZ1}/>
        <label>Z2</label>
        <input name="roiZ2" value={this.state.roiZ2}/>
      </div>
    );
  }

  onWindowResize() {
    console.log("onWindowResize");
    cornerstone.resize(this.element);
  }

  onImageRendered() {
    const viewport = cornerstone.getViewport(this.element);
    const roiToolState = cornerstoneTools.getToolState(this.element, "rectangleRoi");
    if (roiToolState.data.length > 0) {
      const start = roiToolState.data[0].handles.start
      const end = roiToolState.data[0].handles.end
      this.setState({
        roiX1: Math.floor(start.x),
        roiX2: Math.floor(end.x),
        roiY1: Math.floor(start.y),
        roiY2: Math.floor(end.y)
      });
    }

    const toolStateManager = cornerstoneTools.getElementToolStateManager(this.element);
    const existingToolState = toolStateManager.saveToolState();
    // console.log(existingToolState);
    // console.log(measurementData);
    if (existingToolState.rectangleRoi.data.length !== 1) {
      existingToolState.rectangleRoi = {data: [measurementData]};
      toolStateManager.restoreToolState(existingToolState);
    }

    this.setState({
      viewport
    });

    console.log(this.state.viewport);
  }

  onNewImage() {
    const enabledElement = cornerstone.getEnabledElement(this.element);
    this.setState({
      imageId: enabledElement.image.imageId
    });
  }

  componentDidMount() {
    const element = this.element;

    // Enable the DOM Element for use with Cornerstone
    cornerstone.enable(element);

    // Load the first image in the stack
    cornerstone.loadImage(this.state.imageId).then(image => {
      // Display the first image
      cornerstone.displayImage(element, image);

      // Add the stack tool state to the enabled element
      const stack = this.state.stack;
      cornerstoneTools.addStackStateManager(element, ["stack", "rectangleRoi"]);
      cornerstoneTools.addToolState(element, "stack", stack);

      cornerstoneTools.mouseInput.enable(element);
      cornerstoneTools.mouseWheelInput.enable(element);
      cornerstoneTools.wwwc.activate(element, 1);
      cornerstoneTools.rectangleRoi.deactivate(element, 1); // ww/wc is the default tool for left mouse button
      cornerstoneTools.pan.activate(element, 2); // pan is the default tool for middle mouse button
      cornerstoneTools.zoom.activate(element, 4); // zoom is the default tool for right mouse button
      cornerstoneTools.stackScrollWheel.activate(element); // zoom is the default tool for middle mouse wheel

      element.addEventListener(
        "cornerstoneimagerendered",
        this.onImageRendered
      );
      element.addEventListener("cornerstonenewimage", this.onNewImage);
      window.addEventListener("resize", this.onWindowResize);
    });
  }

  componentWillUnmount() {
    const element = this.element;
    element.removeEventListener(
      "cornerstoneimagerendered",
      this.onImageRendered
    );

    element.removeEventListener("cornerstonenewimage", this.onNewImage);

    window.removeEventListener("resize", this.onWindowResize);

    cornerstone.disable(element);
  }

  componentDidUpdate(prevProps, prevState) {
    const stackData = cornerstoneTools.getToolState(this.element, "stack");
    const stack = stackData.data[0];
    stack.currentImageIdIndex = this.state.stack.currentImageIdIndex;
    stack.imageIds = this.state.stack.imageIds;
    cornerstoneTools.addToolState(this.element, "stack", stack);

    //const imageId = stack.imageIds[stack.currentImageIdIndex];
    //cornerstoneTools.scrollToIndex(this.element, stack.currentImageIdIndex);
  }
}

const stack = {
  imageIds: imageIds,
  currentImageIdIndex: 0
};

const App = () => (
  <div>
    <h2>Cornerstone React Component Example</h2>
    <CornerstoneElement stack={{ ...stack }} />
  </div>
);

export default App;
