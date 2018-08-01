import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { get } from '../utils/Backend';

import '../assets/Preprocess.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      annotationGroups: [],
      annotationLoaded: false,
    }
  }

  componentDidMount() {
    get(`annotator/get-annotation-groups?user=${this.props.user}`).then((res) => {
      this.setState({
        annotationGroups: res.data,
        annotationLoaded: true,
      });
    });
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
          {this.state.annotationGroups.length > 0 ?
            <div>
              Annotations
              <div className="dropdown">
                <button className="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.props.currentAnnotation}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {
                    this.state.annotationGroups.map((each) => {
                      return (
                        <Link to={`/u/${this.props.user}/annotate/${each.name}`} key={each.name}>
                          <span
                            className="dropdown-item"
                          >{each.name}</span>
                        </Link>
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
