import React, { Component } from 'react';
import DropZone from 'react-dropzone';

import { get, post, postFileData } from '../utils/Backend';

import NavbarDataset from '../components/NavbarDataset';
import '../assets/Upload.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileSent: {},
      fileLoading: [],
      recentFiles: [],
      currentTab: 'local',
      dropboxPath: '',
      dropboxToken: '',
    }

    this.handleUploadDataset = this.handleUploadDataset.bind(this);
    this.handleClickTab = this.handleClickTab.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUploadDatasetFromDropbox = this.handleUploadDatasetFromDropbox.bind(this);
  }

  handleUploadDataset(files, reject) {
    if (reject.length > 0) {
      alert('Only drop cab files');
      return;
    }

    const fileLoading = this.state.fileLoading;
    files.forEach((file) => {
      fileLoading.push({name: file.name, id: file.name});
    });
    this.setState({
      fileLoading,
    });
    postFileData('upload-dataset', files, {user: this.props.match.params.user});
  }

  handleUploadDatasetFromDropbox() {
    post('upload-dropbox-dataset', {
      user: this.props.match.params.user,
      path: this.state.dropboxPath,
      token: this.state.dropboxToken
    }).then((res) => {
      console.log(res);
    });
  }

  handleClickTab(tab) {
    return () => {
      this.setState({ currentTab: tab });
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  componentDidMount() {
    get(`get-dataset?user=${this.props.match.params.user}&dataset=default`).then((res) => {
      console.log(res);
      const fileLoading = [];
      res.data.forEach((each) => {
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
      get(`get-dataset?user=${this.props.match.params.user}&dataset=default`).then((res) => {
        const fileLoading = [];
        res.data.forEach((each) => {
          if (each.status === 'running') {
            fileLoading.push(each);
          }
        });

        res.data.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        this.setState({
          fileLoading,
          recentFiles: res.data
        });
      });
    }, 20000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className="upload-container">
        <NavbarDataset user={this.props.match.params.user}/>
        <div className="header-name">
          Dataset {this.props.match.params.user}
        </div>
        <div className="row" style={{marginLeft: 0, marginRight: 0}}>
          <div className="col-8">
            <div className="card text-center data-upload-card">
              <div className="card-header">
                <ul className="nav nav-pills card-header-pills">
                  <li className="nav-item">
                    <a
                      className={`nav-link ${this.state.currentTab === 'local' && 'active'}`}
                      href="#"
                      onClick={this.handleClickTab('local')}
                    >Local</a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link ${this.state.currentTab === 'dropbox' && 'active'}`}
                      href="#"
                      onClick={this.handleClickTab('dropbox')}
                    >Dropbox</a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {this.state.currentTab === 'local' &&
                  <DropZone
                    onDrop={this.handleUploadDataset}
                    accept=".cab"
                    className='data-dropzone'
                  >
                    <div>
                      Click to upload a file (or drag a file.) File must be .cab files.
                    </div>
                  </DropZone>
                }
                {this.state.currentTab === 'dropbox' &&
                  <div>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Dropbox path</span>
                      </div>
                      <input
                        name="dropboxPath"
                        type="text"
                        className="form-control"
                        onChange={this.handleInputChange} />
                    </div>
                    <div className="text-caption">
                      <p className="figure-caption">The path of the folder in Dropbox. '/' represents the root folder in Dropbox (when you visit https://www.dropbox.com/home). When you specify a Dropbox folder, all .cab files within the folder will be downloaded.</p>
                    </div>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-default">Dropbox token</span>
                      </div>
                      <input
                        name="dropboxToken"
                        type="text"
                        className="form-control"
                        onChange={this.handleInputChange} />
                    </div>
                    <div className="text-caption">
                      <p className="figure-caption">Get an access token from https://www.dropbox.com/developers.</p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={this.handleUploadDatasetFromDropbox}>
                      Create upload job
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card upload-card">
              <div className="card-body">
                <h5 className="card-title">Currently preprocessing</h5>
                {
                  this.state.fileLoading.map((file) => {
                    return <p key={file.name} className="card-text">{file.name}</p>
                  })
                }
              </div>
            </div>
            <div className="card upload-card">
              <div className="card-body">
                <h5 className="card-title">Recent logs</h5>
                {
                  this.state.recentFiles.map((file) => {
                    return (
                      <p style={{fontSize: '0.8em', marginBottom: '0'}}key={file.name} className="card-text">
                        {file.name}: {file.message}
                      </p>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
