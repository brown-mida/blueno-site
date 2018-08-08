import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../assets/Annotator.css';


class PlaneSVG extends Component {

  createLineElement() {
    return (
        <line x1="0"
              y1={this.props.lineIndex}
              x2={this.props.width}
              y2={this.props.lineIndex}
              style={{
                stroke: 'white',
                strokeWidth: 2,
              }}
        />
    );
  }

  createLines() {

  }


  render() {
    return (
        <svg
          viewBox={`0 0 ${this.props.width} ${this.props.height}`}
          onWheel={this.props.scrollEvent}
          className='svg-image'
        >
          <image
            xlinkHref={`/annotator/get-image-slice?user=${this.props.user}&id=${this.props.patientId}&type=${this.props.viewType}&slice=${this.props.posIndex}`}
            x="0"
            y="0"
            height={`${this.props.height}px`}
            width={`${this.props.width}px`} />
          {this.props.lineIndex ? this.createLineElement() : null}
          {this.props.annotationType === 'bbox' &&
            <line x1={this.props.roiX1}
              y1={this.props.roiY1}
              x2={this.props.roiX2}
              y2={this.props.roiY1}
              style={{
                stroke: this.props.colorX,
                strokeWidth: 2,
              }}
            />
          }
          {this.props.annotationType === 'bbox' &&
            <line x1={this.props.roiX1}
              y1={this.props.roiY2}
              x2={this.props.roiX2}
              y2={this.props.roiY2}
              style={{
                stroke: this.props.colorX,
                strokeWidth: 2,
              }}
            />
          }
          {this.props.annotationType === 'bbox' &&
            <line x1={this.props.roiX1}
              y1={this.props.roiY1}
              x2={this.props.roiX1}
              y2={this.props.roiY2}
              style={{
                stroke: this.props.colorY,
                strokeWidth: 2,
              }}
            />
          }
          {this.props.annotationType === 'bbox' &&
            <line x1={this.props.roiX2}
              y1={this.props.roiY1}
              x2={this.props.roiX2}
              y2={this.props.roiY2}
              style={{
                stroke: this.props.colorY,
                strokeWidth: 2,
              }}
            />
          }

        </svg>
    );
  }
}

PlaneSVG.propTypes = {
  viewType: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  colorX: PropTypes.any,
  colorY: PropTypes.any,
  roiX1: PropTypes.number,
  roiX2: PropTypes.number,
  roiY1: PropTypes.number,
  roiY2: PropTypes.number,
  posIndex: PropTypes.number.isRequired,
  lineIndex: PropTypes.number,
  scrollEvent: PropTypes.func,
  annotationType: PropTypes.string.isRequired,
};


export default PlaneSVG;

