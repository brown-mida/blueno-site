import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Comp extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to='/'>Blueno</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="nav-link" to={'/annotator'}>
                Annotate ELVOs (beta) <span className="sr-only">(current)</span>
              </Link>
            </li>
             <li className="nav-item active">
              <Link className="nav-link" to={`/trainer`}>
                Train ELVOs (beta) <span className="sr-only">(current)</span>
              </Link>
             </li>
          </ul>
            <Link className="nav-link" to={`/u/abc`}>
              Sign in (alpha) <span className="sr-only">(current)</span>
            </Link>
        </div>
      </nav>
    );
  }
}

export default Comp;
