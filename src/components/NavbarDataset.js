import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../assets/NavbarDataset.css';

class Comp extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">
          Blueno
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to={`/u/${this.props.user}`}>
                Overview <span className="sr-only">(current)</span>
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to={`/u/${this.props.user}/upload`}>
                Upload
              </Link>
            </li>
            <li className="nav-item active">
              <Link
                className="nav-link"
                to={`/u/${this.props.user}/preprocess`}
              >
                Preprocessing
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to={`/u/${this.props.user}/annotate`}>
                Annotate
              </Link>
            </li>
            <li className="nav-item active">
              <Link className="nav-link" to={`/u/${this.props.user}/train`}>
                Train
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Comp;
