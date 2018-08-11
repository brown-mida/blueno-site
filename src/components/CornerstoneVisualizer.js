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

function createImageIds(url) {
  const imageIds = [];
  for (let i = 0; i < 200; i++) {
    imageIds.push(`${url}&slice=${i}`);
  }
  return imageIds;
}

function createData(x1, x2, y1, y2) {
  return {
    visible: true,
    active: false,
    invalidated: true,
    handles: {
        start: {
            x: x1,
            y: y1,
            highlight: true,
            active: false
        },
        end: {
            x: x2,
            y: y2,
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
}

const divStyle = {
  width: "30vw",
  height: "30vw",
  position: "relative",
  color: "white",
  marginBottom: "30px",
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
    const stack = {
      imageIds: createImageIds(props.url),
      currentImageIdIndex: 100
    };

    this.state = {
      stack: stack,
      viewport: cornerstone.getDefaultViewport(null, undefined),
      imageId: stack.imageIds[100],
    };

    this.onImageRendered = this.onImageRendered.bind(this);
    this.onNewImage = this.onNewImage.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
  }

  render() {
    return (
      <div onContextMenu={(e) => {e.preventDefault()}}>
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
      const start = roiToolState.data[0].handles.start;
      const end = roiToolState.data[0].handles.end;
      this.props.updateCoords(Math.floor(start.x), Math.floor(end.x),
                              Math.floor(start.y), Math.floor(end.y),
                              this.props.label_x1, this.props.label_x2,
                              this.props.label_y1, this.props.label_y2);
    }

    const toolStateManager = cornerstoneTools.getElementToolStateManager(this.element);
    const existingToolState = toolStateManager.saveToolState();
    if (existingToolState.rectangleRoi.data.length !== 1) {
      existingToolState.rectangleRoi = {
        data: [createData(this.props.x1, this.props.x2, this.props.y1, this.props.y2)]
      };
      toolStateManager.restoreToolState(existingToolState);
    }

    this.setState({
      viewport
    });
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
      const stack = {
        imageIds: createImageIds(this.props.url),
        currentImageIdIndex: 100
      };
      cornerstoneTools.addStackStateManager(element, ["stack", "rectangleRoi"]);
      cornerstoneTools.addToolState(element, "stack", stack);

      cornerstoneTools.mouseInput.enable(element);
      cornerstoneTools.mouseWheelInput.enable(element);
      cornerstoneTools.wwwc.activate(element, 1);
      cornerstoneTools.rectangleRoi.deactivate(element, 1);
      cornerstoneTools.pan.activate(element, 2);
      cornerstoneTools.zoom.activate(element, 4);
      cornerstoneTools.stackScrollWheel.activate(element);

      element.addEventListener(
        "cornerstoneimagerendered",
        this.onImageRendered
      );
      element.addEventListener("cornerstonenewimage", this.onNewImage);
      window.addEventListener("resize", this.onWindowResize);

      const toolStateManager = cornerstoneTools.getElementToolStateManager(this.element);
      const existingToolState = toolStateManager.saveToolState();
      existingToolState.rectangleRoi = {
        data: [createData(this.props.x1, this.props.x2, this.props.y1, this.props.y2)]
      };
      toolStateManager.restoreToolState(existingToolState);
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

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.x1 !== this.props.x1 ||
      nextProps.x2 !== this.props.x2 ||
      nextProps.y1 !== this.props.y1 ||
      nextProps.y2 !== this.props.y2
    ) {
      const toolStateManager = cornerstoneTools.getElementToolStateManager(this.element);
      const existingToolState = toolStateManager.saveToolState();
      if (existingToolState.rectangleRoi &&
          existingToolState.rectangleRoi.data.length > 0 &&
          !existingToolState.rectangleRoi.data[0].active) {
        existingToolState.rectangleRoi = {
          data: [createData(nextProps.x1, nextProps.x2, nextProps.y1, nextProps.y2)]
        };
        toolStateManager.restoreToolState(existingToolState);
        cornerstone.draw(this.element);
      }
    }
  }
}

export default CornerstoneElement;
