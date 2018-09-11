import React, { Component } from 'react';

import { get } from '../utils/Backend';

import NavbarDataset from '../components/NavbarDataset';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileLoading: [],
      recentFiles: [],
    };
  }

  componentDidMount() {
    get(
      `get-dataset?user=${this.props.match.params.user}&dataset=default`
    ).then(res => {
      const fileLoading = [];
      res.data.forEach(each => {
        if (each.status === 'running') {
          fileLoading.push(each);
        }
      });

      res.data.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      this.setState({
        fileLoading,
        recentFiles: res.data,
      });
    });

    this.interval = setInterval(() => {
      get(
        `get-dataset?user=${this.props.match.params.user}&dataset=default`
      ).then(res => {
        const fileLoading = [];
        res.data.forEach(each => {
          if (each.status === 'running') {
            fileLoading.push(each);
          }
        });

        res.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        this.setState({
          fileLoading,
          recentFiles: res.data,
        });
      });
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        <NavbarDataset user={this.props.match.params.user} />
        <div className="App">
          <div className="header-name">
            Dataset {this.props.match.params.user}
          </div>
          <div className="row">
            <div className="col-6">
              <div className="card upload-card">
                <div className="card-body">
                  <h5 className="card-title">Currently preprocessing</h5>
                  {this.state.fileLoading.map(file => {
                    return (
                      <p key={file.name} className="card-text">
                        {file.name}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card upload-card">
                <div className="card-body">
                  <h5 className="card-title">Upload log</h5>
                  {this.state.recentFiles.map(file => {
                    return (
                      <p
                        style={{ fontSize: '0.8em', marginBottom: '0' }}
                        key={file.name}
                        className="card-text"
                      >
                        {file.name}: {file.message}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="card upload-card">
                <div className="card-body">
                  <h5 className="card-title">Preprocessing log</h5>A
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card upload-card">
                <div className="card-body">
                  <h5 className="card-title">Training log</h5>A
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
