import React, { Component } from 'react';

import { get } from '../utils/Backend';

import '../assets/Preprocess.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      annotations: [],
      annotationLoaded: false,
    }

    this.handleClickAnnotation = this.handleClickAnnotation.bind(this);
  }

  componentDidMount() {
    get(`annotator/get-annotation-groups?user=${this.props.user}`).then((res) => {
      console.log(res.data);
      if (res.data.length > 0) {
        this.props.updateCurrentAnnotation(res.data[0]).then(() => {
          this.setState({
            annotations: res.data,
            annotationLoaded: true,
          });
        });
      } else {
        this.setState({
          annotationLoaded: true,
        });
      }
    });
  }

  handleClickAnnotation(annotation) {
    return () => {
      if (this.props.currentAnnotation !== annotation) {
        this.props.updateCurrentAnnotation(annotation);
      }
    }
  }

  render() {
    if (!this.state.annotationLoaded) {
      return (
        <div>
          Annotations
          <br />
          Loading...
        </div>
      );
    } else {
      return (
        <div>
          {this.state.annotations.length > 0 ?
            <div>
              Annotations
              <div className="dropdown">
                <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.props.currentAnnotation.name}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {
                    this.state.annotations.map((each) => {
                      return (
                        <span
                          key={each.name}
                          className="dropdown-item"
                          onClick={this.handleClickAnnotation(each)}
                        >{each.name}</span>
                      );
                    })
                  }
                </div>
                <div>
                  Click on the image to annotate it.
                </div>
              </div>
            </div> :
            <div>
              Annotations
              <br />
              You have no annotations. Make one at the Create tab.
            </div>
          }
        </div>
      );
    }
  }
}

export default App;
