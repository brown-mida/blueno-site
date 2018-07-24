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
      recentFiles: []
    }

    this.handleUploadDataset = this.handleUploadDataset.bind(this);
  }

  handleUploadDataset(files, reject) {
    if (reject.length > 0) {
      alert('Only drop cab files');
      return;
    }
    console.log(files);

    const fileLoading = this.state.fileLoading;
    files.forEach((file) => {
      fileLoading.push({name: file.name, id: file.name});
    });
    this.setState({
      fileLoading,
    });
    postFileData('upload-dataset', files, {user: this.props.match.params.user});
  }

  componentDidMount() {
    get(`get-dataset?user=${this.props.match.params.user}`).then((res) => {
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

    setInterval(() => {
      get(`get-dataset?user=${this.props.match.params.user}`).then((res) => {
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
    }, 5000);
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
            <DropZone
              onDrop={this.handleUploadDataset}
              accept=".cab"
              className='data-dropzone'
            >
              <div>
                Click to upload a file (or drag a file.) File must be .cab files.
              </div>
            </DropZone>
          </div>
          <div className="col-4">
            <div className="card upload-card">
              <div className="card-body">
                <h5 className="card-title">Currently preprocessing</h5>
                {
                  this.state.fileLoading.map((file) => {
                    return <p key={file.id} className="card-text">{file.name}</p>
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
                      <p style={{fontSize: '0.8em', marginBottom: '0'}}key={file.id} className="card-text">
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
